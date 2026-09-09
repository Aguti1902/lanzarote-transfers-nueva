import { buildTourSlugRedirects } from "../i18n/tour-slugs";
import type { Locale } from "../i18n/config";

const TRANSFER_BY_LOCALE: Record<Locale, string> = {
  es: "/es/traslados-aeropuerto-lanzarote",
  en: "/en/airport-transfers",
  de: "/de/flughafen-transfer",
};

const RETIRED_SECTION_RE =
  /^\/(?:(es|en|de)\/)?(?:excursiones(?:-cruceros)?|excursions|shore-excursions|cruise-excursions|ausfluege|ausfluge|ausflüge|kreuzfahrtausfluege|kreuzfahrtausfluge|kreuzfahrtausflüge|cruceros?|cruises?|kreuzfahrten?|cruceristas|cruise-passengers|kreuzfahrtgaeste|casas(?:-vacacionales)?|holiday-homes|vacation-homes|ferienhaeuser|ferienhauser|ferienhäuser|carrito|cart|warenkorb)(?:\/|$)/i;

const RETIRED_ADMIN =
  /^\/admin\/(?:casas|excursiones(?:-shore)?|cruceros|companias-cruceros|grupos-cruceros|puertos-cruceros|reservas-cruceros)(?:\/|$)/i;

function localeFromPath(pathname: string): Locale {
  const match = pathname.match(/^\/(es|en|de)(?:\/|$)/i);
  const code = match?.[1]?.toLowerCase();
  if (code === "en" || code === "de" || code === "es") return code;
  return "es";
}

/**
 * Redirecciones permanentes desde URLs de la web antigua
 * (lanzaroteexperiencetours.com) y de secciones retiradas (excursiones, cruceros, casas).
 *
 * Clave: pathname sin barra final, en minúsculas.
 * Valor: destino absoluto (con locale y slugs del idioma).
 */
export const LEGACY_PATH_REDIRECTS: Record<string, string> = {
  "/casas-vacacionales": TRANSFER_BY_LOCALE.es,
  "/traslados-aeropuerto": TRANSFER_BY_LOCALE.es,

  "/es/about-us": "/es/sobre-nosotros",
  "/es/contact": "/es/contacto",
  "/es/cart": TRANSFER_BY_LOCALE.es,
  "/es/carrito": TRANSFER_BY_LOCALE.es,
  "/es/manage-booking": "/es/gestionar-reserva",
  "/es/casas-vacacionales": TRANSFER_BY_LOCALE.es,
  "/es/traslados": TRANSFER_BY_LOCALE.es,
  "/es/traslados-aeropuerto": TRANSFER_BY_LOCALE.es,
  "/es/holiday-homes": TRANSFER_BY_LOCALE.es,
  "/es/vacation-homes": TRANSFER_BY_LOCALE.es,

  "/en/sobre-nosotros": "/en/about-us",
  "/en/contacto": "/en/contact",
  "/en/carrito": TRANSFER_BY_LOCALE.en,
  "/en/cart": TRANSFER_BY_LOCALE.en,
  "/en/gestionar-reserva": "/en/manage-booking",
  "/en/cancelar-reserva": "/en/cancel-booking",
  "/en/excursiones": TRANSFER_BY_LOCALE.en,
  "/en/traslados": TRANSFER_BY_LOCALE.en,
  "/en/transfers-airport": TRANSFER_BY_LOCALE.en,
  "/en/excursiones-cruceros": TRANSFER_BY_LOCALE.en,
  "/en/cruise-excursions": TRANSFER_BY_LOCALE.en,
  "/en/casas": TRANSFER_BY_LOCALE.en,
  "/en/vacation-homes": TRANSFER_BY_LOCALE.en,
  "/en/casas-vacacionales": TRANSFER_BY_LOCALE.en,
  "/en/cruceristas": TRANSFER_BY_LOCALE.en,
  "/en/cruceros": TRANSFER_BY_LOCALE.en,
  "/en/factura": "/en/invoice",
  "/en/reserva/confirmacion": "/en/booking/confirmation",

  "/de/sobre-nosotros": "/de/uber-uns",
  "/de/contacto": "/de/kontakt",
  "/de/carrito": TRANSFER_BY_LOCALE.de,
  "/de/warenkorb": TRANSFER_BY_LOCALE.de,
  "/de/gestionar-reserva": "/de/buchung-verwalten",
  "/de/cancelar-reserva": "/de/buchung-stornieren",
  "/de/excursiones": TRANSFER_BY_LOCALE.de,
  "/de/traslados": TRANSFER_BY_LOCALE.de,
  "/de/excursiones-cruceros": TRANSFER_BY_LOCALE.de,
  "/de/casas": TRANSFER_BY_LOCALE.de,
  "/de/casas-vacacionales": TRANSFER_BY_LOCALE.de,
  "/de/ferienhauser": TRANSFER_BY_LOCALE.de,
  "/de/ferienhäuser": TRANSFER_BY_LOCALE.de,
  "/de/ausflüge": TRANSFER_BY_LOCALE.de,
  "/de/kreuzfahrtausflüge": TRANSFER_BY_LOCALE.de,
  "/de/cruceristas": TRANSFER_BY_LOCALE.de,
  "/de/cruceros": TRANSFER_BY_LOCALE.de,
  "/de/factura": "/de/rechnung",
  "/de/reserva/confirmacion": "/de/buchung/bestaetigung",
  "/de/about-us": "/de/uber-uns",
  "/de/contact": "/de/kontakt",
  "/de/cart": TRANSFER_BY_LOCALE.de,
  "/de/manage-booking": "/de/buchung-verwalten",

  ...buildTourSlugRedirects(),
};

/**
 * Prefijos legacy: conserva el resto del path.
 * Solo para variantes que aún no están en el mapa exacto.
 */
export const LEGACY_PREFIX_REWRITES: Array<{
  fromPrefix: string;
  toPrefix: string;
}> = [];

export function normalizePathname(pathname: string): string {
  if (!pathname) return "/";
  const noQuery = pathname.split("?")[0] || "/";
  if (noQuery.length > 1 && noQuery.endsWith("/")) {
    return noQuery.slice(0, -1);
  }
  return noQuery || "/";
}

export function resolveLegacyRedirect(pathname: string): string | null {
  const path = normalizePathname(pathname);
  const lower = path.toLowerCase();

  if (RETIRED_ADMIN.test(lower)) return "/admin";
  if (RETIRED_SECTION_RE.test(lower)) {
    return TRANSFER_BY_LOCALE[localeFromPath(lower)];
  }

  const exact =
    LEGACY_PATH_REDIRECTS[lower] || LEGACY_PATH_REDIRECTS[path] || null;
  if (exact) return exact;

  for (const rule of LEGACY_PREFIX_REWRITES) {
    const from = rule.fromPrefix.toLowerCase();
    if (lower.startsWith(from) && rule.fromPrefix !== rule.toPrefix) {
      const rest = path.slice(rule.fromPrefix.length);
      return `${rule.toPrefix}${rest}`.replace(/\/{2,}/g, "/");
    }
  }

  return null;
}
