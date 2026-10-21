import type { Locale } from "@/i18n/config";
import type { TransferDestination } from "@/types";

export type DestinationCopy = {
  seoTitle: string;
  seoDescription: string;
  headline: string;
  tagline?: string;
  html: string;
  /** Path público sin locale, p. ej. /aeropuerto-playa-blanca */
  publicPath?: Partial<Record<Locale, string>>;
};

const PLAYA_BLANCA_HTML: Record<Locale, string> = {
  es: `
<p>Disfruta de un traslado cómodo y directo desde el Aeropuerto de Lanzarote hasta tu alojamiento en Playa Blanca.</p>
<p>Tu chófer te estará esperando en la terminal de llegadas con un cartel identificativo, listo para llevarte a tu hotel, apartamento o villa privada.</p>
<p>Sin compartir vehículo, sin esperas innecesarias y con la tranquilidad de tenerlo todo organizado antes de aterrizar.</p>
<h2>Tu traslado a Playa Blanca</h2>
<ul>
<li><em>Duración:</em> aproximadamente 35–45 minutos.</li>
<li><em>Servicio:</em> privado y directo hasta tu alojamiento.</li>
<li><em>Incluye:</em> recepción en el aeropuerto, seguimiento del vuelo y transporte climatizado.</li>
</ul>
<h2>Descubre Playa Blanca</h2>
<p>Situada en el sur de Lanzarote, Playa Blanca destaca por sus playas, su agradable paseo marítimo y Marina Rubicón.</p>
<p>Tanto si vienes a descansar como a descubrir la isla, nosotros nos encargamos de que llegues cómodamente a tu destino.</p>
<h2>¿Y para volver al aeropuerto?</h2>
<p>También puedes reservar tu traslado de regreso desde Playa Blanca, con recogida directamente en tu alojamiento.</p>
<p><em>Reserva ahora tu traslado privado y disfruta de Lanzarote desde el primer momento.</em></p>
`.trim(),
  en: `
<p>Enjoy a comfortable, direct transfer from Lanzarote Airport to your accommodation in Playa Blanca.</p>
<p>Your driver will be waiting in the arrivals hall with a name sign, ready to take you to your hotel, apartment or private villa.</p>
<p>No shared vehicle, no unnecessary waiting, and the peace of mind of having everything arranged before you land.</p>
<h2>Your transfer to Playa Blanca</h2>
<ul>
<li><em>Duration:</em> about 35–45 minutes.</li>
<li><em>Service:</em> private and direct to your accommodation.</li>
<li><em>Includes:</em> airport meet &amp; greet, flight tracking and an air-conditioned vehicle.</li>
</ul>
<h2>Discover Playa Blanca</h2>
<p>In the south of Lanzarote, Playa Blanca is known for its beaches, seafront promenade and Marina Rubicón.</p>
<p>Whether you are here to rest or to explore the island, we make sure you arrive comfortably.</p>
<h2>Need to go back to the airport?</h2>
<p>You can also book your return transfer from Playa Blanca, with pickup at your accommodation.</p>
<p><em>Book your private transfer now and enjoy Lanzarote from the moment you land.</em></p>
`.trim(),
  de: `
<p>Genießen Sie einen komfortablen, direkten Transfer vom Flughafen Lanzarote zu Ihrer Unterkunft in Playa Blanca.</p>
<p>Ihr Fahrer erwartet Sie in der Ankunftshalle mit einem Namensschild und bringt Sie zu Ihrem Hotel, Apartment oder Ihrer Villa.</p>
<p>Kein geteiltes Fahrzeug, kein unnötiges Warten und die Sicherheit, dass vor der Landung alles organisiert ist.</p>
<h2>Ihr Transfer nach Playa Blanca</h2>
<ul>
<li><em>Dauer:</em> etwa 35–45 Minuten.</li>
<li><em>Service:</em> privat und direkt zu Ihrer Unterkunft.</li>
<li><em>Inklusive:</em> Abholung am Flughafen, Flugverfolgung und klimatisiertes Fahrzeug.</li>
</ul>
<h2>Playa Blanca entdecken</h2>
<p>Im Süden Lanzarotes überzeugt Playa Blanca mit Stränden, Promenade und Marina Rubicón.</p>
<p>Ob Erholung oder Inselerkundung: Wir bringen Sie bequem ans Ziel.</p>
<h2>Zurück zum Flughafen?</h2>
<p>Sie können auch den Rücktransfer ab Playa Blanca buchen, mit Abholung an Ihrer Unterkunft.</p>
<p><em>Buchen Sie jetzt Ihren privaten Transfer und genießen Sie Lanzarote vom ersten Moment an.</em></p>
`.trim(),
};

const COPY: Record<string, Partial<Record<Locale, DestinationCopy>>> = {
  "playa-blanca": {
    es: {
      seoTitle: "Traslado Aeropuerto Lanzarote a Playa Blanca | Privado",
      seoDescription:
        "Reserva tu traslado privado del Aeropuerto de Lanzarote a Playa Blanca. Chófer con cartel y viaje directo a tu alojamiento.",
      headline:
        "Traslado privado del Aeropuerto de Lanzarote a Playa Blanca.",
      tagline: "Tu viaje comienza con nosotros.",
      html: PLAYA_BLANCA_HTML.es,
      publicPath: { es: "/aeropuerto-playa-blanca" },
    },
    en: {
      seoTitle: "Private Lanzarote Airport transfer to Playa Blanca",
      seoDescription:
        "Book a private transfer from Lanzarote Airport to Playa Blanca. Meet & greet with a name sign and a direct ride to your stay.",
      headline: "Private transfer from Lanzarote Airport to Playa Blanca.",
      tagline: "Your trip starts with us.",
      html: PLAYA_BLANCA_HTML.en,
    },
    de: {
      seoTitle: "Privater Transfer Flughafen Lanzarote nach Playa Blanca",
      seoDescription:
        "Buchen Sie einen privaten Transfer vom Flughafen Lanzarote nach Playa Blanca. Fahrer mit Namensschild und direkte Fahrt zur Unterkunft.",
      headline: "Privater Transfer vom Flughafen Lanzarote nach Playa Blanca.",
      tagline: "Ihre Reise beginnt mit uns.",
      html: PLAYA_BLANCA_HTML.de,
    },
  },
};

function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getDestinationCopy(
  dest: Pick<TransferDestination, "id" | "slug"> & { name?: string },
  locale: Locale
): DestinationCopy | null {
  const keys = [dest.id, dest.slug, dest.name ? slugifyName(dest.name) : ""]
    .map((k) => k.trim())
    .filter(Boolean);
  const byId = keys.map((k) => COPY[k]).find(Boolean);
  if (!byId) return null;
  return byId[locale] || byId.es || null;
}

export function destinationBodyHtml(
  dest: TransferDestination,
  locale: Locale
): string {
  const copy = getDestinationCopy(dest, locale);
  const custom = dest.description?.trim() || "";
  if (copy) {
    if (
      custom.includes("<h2>") &&
      !/\d+\s*€|from\s+\d+|ab\s+\d+\s*€/i.test(custom)
    ) {
      return custom;
    }
    return copy.html;
  }
  return custom;
}

export function destinationInternalPath(
  dest: Pick<TransferDestination, "slug">
): string {
  return `/traslados-aeropuerto-lanzarote/${dest.slug}`;
}

/** Path interno (ES) de un alias SEO corto, o null. */
export function destinationAliasToInternal(pathname: string): string | null {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (clean === "/aeropuerto-playa-blanca") {
    return "/traslados-aeropuerto-lanzarote/playa-blanca";
  }
  return null;
}

export function destinationPublicPath(
  dest: Pick<TransferDestination, "id" | "slug">,
  locale: Locale
): string {
  const copy = getDestinationCopy(dest, locale);
  return copy?.publicPath?.[locale] || destinationInternalPath(dest);
}
