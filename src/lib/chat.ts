import { getSettings, getTransfersData } from "@/lib/content";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

async function buildKnowledge(): Promise<string> {
  const [transfers, settings] = await Promise.all([
    getTransfersData(),
    getSettings(),
  ]);

  const transferLines = transfers.destinations
    .map((d) => `- Aeropuerto ↔ ${d.name}${d.duration ? ` (${d.duration})` : ""}`)
    .join("\n");

  return `
Empresa: ${settings.brandName}
Teléfono: ${settings.phone}
Email: ${settings.email}
Horario: ${settings.hours}

TRASLADOS PRIVADOS (recibimiento con cartel):
${transferLines}
Ventajas: ${transfers.highlights.join("; ")}

INFO CLAVE:
- Traslados 100% privados entre el Aeropuerto de Lanzarote (ACE) y hoteles/villas.
- El precio es por vehículo (no por persona). Se confirma al reservar.
- Se puede reservar solo ida, solo vuelta o ida y vuelta.
- Si el vuelo se retrasa, se adapta la recogida. Indique número de vuelo al reservar.
- Cancelación gratuita habitualmente hasta 24h antes.
- Reserva online en /traslados-aeropuerto-lanzarote
`.trim();
}

function localReply(message: string, knowledge: string): string {
  const q = normalize(message);

  if (
    /hola|buenas|hey|hello|buenos dias|buenas tardes|saludos/.test(q) &&
    q.length < 40
  ) {
    return "¡Hola! Soy el asistente de Lanzarote Transfers. Puedo ayudarte con destinos y la reserva de tu traslado privado al aeropuerto. ¿A qué zona vas?";
  }

  if (/gracias|thank/.test(q)) {
    return "¡De nada! Si quieres, te ayudo a reservar en /traslados.";
  }

  if (/traslad|aeropuerto|taxi|recogida|transfer|playa blanca|puerto del carmen|costa teguise|arrecife|puerto calero|hotel/.test(q)) {
    const lines = knowledge
      .split("\n")
      .filter((l) => l.includes("Aeropuerto ↔"))
      .join("\n");
    return `Traslados 100% privados, con cartel con tu nombre en la terminal.\n\n${lines}\n\nPuedes reservar en /traslados. ¿A qué zona vas?`;
  }

  if (/pago|bizum|tarjeta|efectivo|cobro/.test(q)) {
    return "Los traslados se pagan online con tarjeta o Bizum. El precio es por vehículo. Si tienes dudas de un cobro concreto, llámanos o reserva desde /traslados.";
  }

  if (/retraso|delay|vuelo|flight/.test(q)) {
    return "Si tu vuelo se retrasa, adaptamos la recogida. Indica el número de vuelo al reservar y el chófer te esperará en llegadas con un cartel con tu nombre.";
  }

  if (/precio|cuanto|cuesta|tarif|euro|€/.test(q)) {
    return "La tarifa es por vehículo y se confirma al reservar, según destino, trayecto y número de pasajeros. Puedes ver el total en el formulario de /traslados.";
  }

  if (/cancel|reembol|anular/.test(q)) {
    return "Puedes cancelar de forma gratuita hasta 24 horas antes de la recogida. Con menos de 24 h normalmente no hay reembolso. Si ya tienes reserva, usa /gestionar-reserva.";
  }

  if (/contacto|telefono|llamar|email|correo|whatsapp|horario/.test(q)) {
    const phone = knowledge.match(/Teléfono: (.+)/)?.[1] || "+34 646 08 05 85";
    const email = knowledge.match(/Email: (.+)/)?.[1] || "info@lanzarotetransfers.es";
    const hours = knowledge.match(/Horario: (.+)/)?.[1] || "Contacto 24 / 7";
    return `Puedes contactarnos en ${phone} o ${email}. Horario: ${hours}. También puedes reservar online desde /traslados.`;
  }

  if (/reserva|reservar|book|contratar/.test(q)) {
    return "Puedes reservar online en /traslados: elige destino, ida o ida y vuelta, fecha, hora y pasajeros. El chófer te espera con cartel en el aeropuerto.";
  }

  return "Puedo ayudarte con:\n• Traslados aeropuerto ↔ hotel\n• Precios por destino\n• Ida, vuelta o ida y vuelta\n• Retrasos de vuelo y cancelación\n\nPregúntame, por ejemplo: «Traslado a Playa Blanca».";
}

const langName: Record<string, string> = {
  es: "español",
  en: "English",
  de: "Deutsch",
};

async function openaiReply(
  messages: ChatMessage[],
  knowledge: string,
  locale: string
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const language = langName[locale] || "español";

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `You are the booking assistant for Lanzarote Transfers, a private airport transfer company in Lanzarote. Reply in ${language}, briefly, clearly and kindly (max 120 words unless listing prices). Use only this company information. If unsure, invite the user to contact us or book on the website. Do not invent prices missing from the context. Include internal links when helpful (/${locale}/lanzarote-airport-transfer or /${locale}/traslados-aeropuerto-lanzarote). Use the URL slug language matching ${locale}. This company does NOT sell excursions or cruises — only private transfers.

CONTEXT:
${knowledge}`,
          },
          ...messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export async function answerChat(
  messages: ChatMessage[],
  locale = "es"
): Promise<{
  reply: string;
  mode: "openai" | "local";
}> {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser?.content?.trim()) {
    const empty =
      locale === "en"
        ? "Tell me how I can help: destinations, fares or booking a transfer."
        : locale === "de"
          ? "Sagen Sie mir, womit ich helfen kann: Ziele, Preise oder Transferbuchung."
          : "Cuéntame en qué puedo ayudarte: destinos, tarifas o reservar un traslado.";
    return { reply: empty, mode: "local" };
  }

  const knowledge = await buildKnowledge();
  const ai = await openaiReply(messages, knowledge, locale);
  if (ai) return { reply: ai, mode: "openai" };

  return {
    reply: localReply(lastUser.content, knowledge),
    mode: "local",
  };
}
