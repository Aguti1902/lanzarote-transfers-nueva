import { NextResponse } from "next/server";
import { getSettings, getTransfersData } from "@/lib/content";
import { requireAdmin } from "@/lib/admin-auth";
import { isLocale } from "@/i18n/config";

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const topic = String(body.topic || body.title || "").trim();
    const localeRaw = String(body.locale || "es").toLowerCase();
    const locale = isLocale(localeRaw) ? localeRaw : "es";
    const languageLabel =
      locale === "en"
        ? "inglés"
        : locale === "de"
          ? "alemán"
          : locale === "fr"
            ? "francés"
            : "español";
    if (!topic) {
      return NextResponse.json(
        { error: "Indique un tema o título" },
        { status: 400 }
      );
    }

    const [settings, transfers] = await Promise.all([
      getSettings(),
      getTransfersData(),
    ]);
    const zones = transfers.destinations.map((d) => d.name).join(", ");

    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || "gpt-4o-mini",
          temperature: 0.7,
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: `Eres redactor de ${settings.brandName}, empresa familiar de traslados privados en Lanzarote (aeropuerto ACE ↔ hotel). Responde SOLO JSON válido con keys: title, excerpt, content, tags (array de strings temáticos en el mismo idioma del artículo, sin códigos es/en/de/fr), seoTitle, seoDescription. content en HTML sencillo (<p>, <h2>, <ul>, <strong>). Idioma: ${languageLabel}. Zonas de traslado: ${zones}. No inventes precios. No vendas excursiones.`,
            },
            {
              role: "user",
              content: `Escribe un artículo de blog sobre: ${topic}`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error("OpenAI error");
      const data = await res.json();
      const raw = data.choices?.[0]?.message?.content || "{}";
      const parsed = JSON.parse(raw);
      return NextResponse.json({
        title: parsed.title || topic,
        excerpt: parsed.excerpt || "",
        content: parsed.content || "",
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        seoTitle: parsed.seoTitle || parsed.title || "",
        seoDescription: parsed.seoDescription || parsed.excerpt || "",
        mode: "openai",
      });
    }

    const title = topic.length > 80 ? topic.slice(0, 77) + "…" : topic;
    const copy = {
      es: {
        excerpt: `Guía de ${settings.brandName} sobre ${topic}.`,
        p1: `${title}`,
        p2: `En Lanzarote, un traslado privado evita esperas en el aeropuerto. En este artículo te contamos lo esencial sobre: ${topic}.`,
        p3: `Cubrimos ${zones}. El chófer espera en llegadas con un cartel a tu nombre y el precio es por vehículo.`,
        tags: ["Lanzarote", "traslados", "aeropuerto"],
      },
      en: {
        excerpt: `${settings.brandName} guide to ${topic}.`,
        p1: `${title}`,
        p2: `A private transfer in Lanzarote means no unnecessary waiting at the airport. This article covers: ${topic}.`,
        p3: `We cover ${zones}. Your driver waits in arrivals with a name sign and the fare is per vehicle.`,
        tags: ["Lanzarote", "transfers", "airport"],
      },
      de: {
        excerpt: `Leitfaden von ${settings.brandName} zu ${topic}.`,
        p1: `${title}`,
        p2: `Ein privater Transfer auf Lanzarote bedeutet keine unnötige Wartezeit am Flughafen. Dieser Artikel behandelt: ${topic}.`,
        p3: `Wir fahren nach ${zones}. Der Fahrer wartet in der Ankunftshalle mit Namensschild, der Preis gilt pro Fahrzeug.`,
        tags: ["Lanzarote", "Transfer", "Flughafen"],
      },
      fr: {
        excerpt: `Guide ${settings.brandName} : ${topic}.`,
        p1: `${title}`,
        p2: `Un transfert privé à Lanzarote évite l'attente inutile à l'aéroport. Cet article présente : ${topic}.`,
        p3: `Nous desservons ${zones}. Le chauffeur vous attend aux arrivées avec un panneau à votre nom et le tarif est par véhicule.`,
        tags: ["Lanzarote", "transferts", "aéroport"],
      },
    }[locale];

    return NextResponse.json({
      title,
      excerpt: `<p>${copy.excerpt}</p>`,
      content: `<h2>${copy.p1}</h2><p>${copy.p2}</p><p>${copy.p3}</p>`,
      tags: copy.tags,
      seoTitle: title,
      seoDescription: copy.excerpt,
      mode: "local",
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo generar el artículo" },
      { status: 500 }
    );
  }
}
