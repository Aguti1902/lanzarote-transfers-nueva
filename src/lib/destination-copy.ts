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

const PLAYA_BLANCA_HTML = `
<p>Disfruta de un traslado cómodo y directo desde el Aeropuerto de Lanzarote hasta tu alojamiento en Playa Blanca.</p>
<p>Tu chófer te estará esperando en la terminal de llegadas con un cartel identificativo, listo para llevarte a tu hotel, apartamento o villa privada.</p>
<p>Sin compartir vehículo, sin esperas innecesarias y con la tranquilidad de tenerlo todo organizado antes de aterrizar.</p>
<h2>Tu traslado a Playa Blanca</h2>
<ul>
<li><em>Duración:</em> aproximadamente 35–45 minutos.</li>
<li><em>Precio:</em> desde 80 € por vehículo.</li>
<li><em>Servicio:</em> privado y directo hasta tu alojamiento.</li>
<li><em>Incluye:</em> recepción en el aeropuerto, seguimiento del vuelo y transporte climatizado.</li>
</ul>
<h2>Descubre Playa Blanca</h2>
<p>Situada en el sur de Lanzarote, Playa Blanca destaca por sus playas, su agradable paseo marítimo y Marina Rubicón.</p>
<p>Tanto si vienes a descansar como a descubrir la isla, nosotros nos encargamos de que llegues cómodamente a tu destino.</p>
<h2>¿Y para volver al aeropuerto?</h2>
<p>También puedes reservar tu traslado de regreso desde Playa Blanca, con recogida directamente en tu alojamiento.</p>
<p><em>Reserva ahora tu traslado privado y disfruta de Lanzarote desde el primer momento.</em></p>
`.trim();

const COPY: Record<string, Partial<Record<Locale, DestinationCopy>>> = {
  "playa-blanca": {
    es: {
      seoTitle: "Traslado Aeropuerto Lanzarote a Playa Blanca | Privado",
      seoDescription:
        "Reserva tu traslado privado del Aeropuerto de Lanzarote a Playa Blanca desde 80 € por vehículo. Chófer con cartel, precio cerrado y viaje directo.",
      headline:
        "Traslado privado del Aeropuerto de Lanzarote a Playa Blanca.",
      tagline: "Tu viaje comienza con nosotros.",
      html: PLAYA_BLANCA_HTML,
      publicPath: { es: "/aeropuerto-playa-blanca" },
    },
  },
};

export function getDestinationCopy(
  dest: Pick<TransferDestination, "id" | "slug">,
  locale: Locale
): DestinationCopy | null {
  const byId = COPY[dest.id] || COPY[dest.slug];
  if (!byId) return null;
  return byId[locale] || byId.es || null;
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
