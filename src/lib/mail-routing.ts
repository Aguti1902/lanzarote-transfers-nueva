/**
 * Destinatarios de Lanzarote Transfers.
 * - Reservas, cancelaciones y respuestas de una reserva → reservas@
 * - Formulario y contacto público → info@
 *
 * El envío sale desde un buzón ya verificado. reservas@ e info@
 * solo reciben; si se usan como remitente, el correo se rechaza.
 */

export const BOOKING_EMAIL = "reservas@lanzarotetransfers.es";
export const PUBLIC_CONTACT_EMAIL = "info@lanzarotetransfers.es";
export const VERIFIED_FROM_EMAIL = "booking@lanzaroteexperiencetours.com";

export const MAILBOX = {
  info: PUBLIC_CONTACT_EMAIL,
  booking: BOOKING_EMAIL,
  support: PUBLIC_CONTACT_EMAIL,
  cruise: BOOKING_EMAIL,
} as const;

export type BookingNotifyKind =
  | "request"
  | "booking"
  | "transfer"
  | "cruise";

/** Todas las reservas de esta web llegan al mismo buzón. */
export function resolveBookingMailbox(_input?: {
  type?: string;
  bookingMethod?: string;
  tourId?: string;
  groupId?: string;
  cruiseShip?: string;
  source?: string;
  bookingId?: string;
}): string {
  return BOOKING_EMAIL;
}

/** El buzón de cruceros ya no es distinto del de reservas. */
export function isCruiseMailbox(mailbox: string) {
  return mailbox === "cruise@lanzaroteexperiencetours.com";
}
