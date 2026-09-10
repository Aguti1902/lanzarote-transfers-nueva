import Stripe from "stripe";
import type { PaymentLink } from "@/types";
import { EMAIL_BRAND } from "@/lib/email-layout";

const CHECKOUT_LOGO_PATH = "/images/brand/lanzarote-transfers-dark.png";

function checkoutBranding(
  origin?: string
): Stripe.Checkout.SessionCreateParams["branding_settings"] {
  return {
    display_name: EMAIL_BRAND,
    logo: {
      type: "url",
      url: absoluteUrl(CHECKOUT_LOGO_PATH, origin),
    },
  };
}

let stripeClient: Stripe | null = null;

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (!stripeClient) {
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function absoluteUrl(path: string, origin?: string): string {
  const base =
    origin ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";
  const normalized = base.startsWith("http") ? base : `https://${base}`;
  return `${normalized.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export type StripeCheckoutOptions = {
  origin?: string;
  locale?: string;
  /** Override success URL (absolute or path). */
  successUrl?: string;
  /** Override cancel URL (absolute or path). */
  cancelUrl?: string;
};

/** Create (or recreate) a Stripe Checkout Session for the payment link amount. */
export async function createStripeCheckoutForPayment(
  payment: PaymentLink,
  options?: StripeCheckoutOptions
): Promise<{
  sessionId: string;
  url: string;
  paymentIntentId?: string;
} | null> {
  const stripe = getStripe();
  if (!stripe) return null;

  const amountEuros = Number(payment.amount) || 0;
  if (amountEuros <= 0) {
    throw new Error("El importe del pago debe ser mayor que 0");
  }

  const locale = options?.locale || payment.customerLocale || "es";
  const origin = options?.origin;
  const hash = payment.paymentHash || payment.id;

  const resolveUrl = (override: string | undefined, fallbackPath: string) => {
    if (!override) return absoluteUrl(fallbackPath, origin);
    if (override.startsWith("http")) return override;
    return absoluteUrl(override, origin);
  };

  const successUrl = resolveUrl(
    options?.successUrl,
    `/${locale}/gateway/?h=${encodeURIComponent(hash)}&paid=1`
  );
  const cancelUrl = resolveUrl(
    options?.cancelUrl,
    `/${locale}/gateway/?h=${encodeURIComponent(hash)}&cancelled=1`
  );

  const amountCents = Math.round(amountEuros * 100);
  const chargeLabel = payment.chargeFull
    ? "Pago 100% online"
    : "Pago online (depósito)";
  const descriptionParts = [
    payment.concept,
    payment.serviceTitle ? `Servicio: ${payment.serviceTitle}` : "",
    chargeLabel,
  ].filter(Boolean);

  const bookingIds = [
    ...(payment.bookingIds || []),
    ...(payment.bookingId ? [payment.bookingId] : []),
  ].filter((id, i, arr) => arr.indexOf(id) === i);

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: payment.customerEmail || undefined,
    client_reference_id: payment.id,
    expires_at: Math.floor(Date.now() / 1000) + 31 * 60,
    branding_settings: checkoutBranding(origin),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountCents,
          product_data: {
            name: payment.concept.slice(0, 120) || `Pago ${EMAIL_BRAND}`,
            description: descriptionParts.join(" · ").slice(0, 500),
          },
        },
      },
    ],
    metadata: {
      paymentId: payment.id,
      paymentHash: hash,
      locator: payment.locator,
      serviceType: payment.serviceType || "custom",
      serviceId: payment.serviceId || "",
      bookingId: payment.bookingId || bookingIds[0] || "",
      bookingIds: bookingIds.join(","),
      chargeFull: payment.chargeFull === false ? "0" : "1",
      expectedAmount: String(amountCents),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (error) {
    console.warn(
      "[stripe] branding_settings no aplicado, Checkout sin logo propio:",
      error instanceof Error ? error.message : error
    );
    const { branding_settings: _ignored, ...fallback } = sessionParams;
    session = await stripe.checkout.sessions.create(fallback);
  }

  if (!session.url) {
    throw new Error("Stripe no devolvió URL de Checkout");
  }

  return {
    sessionId: session.id,
    url: session.url,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id,
  };
}

/**
 * Devuelve a la tarjeta el importe indicado vía PaymentIntent de Stripe.
 * `amountEuros` es opcional: si se omite, Stripe reembolsa el total cobrado.
 */
export async function createStripeRefund(input: {
  paymentIntentId: string;
  amountEuros?: number;
  reason?: "duplicate" | "fraudulent" | "requested_by_customer";
  metadata?: Record<string, string>;
}): Promise<{
  refundId: string;
  amountEuros: number;
  status: string;
  paymentIntentId: string;
}> {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe no está configurado");
  }

  const piId = input.paymentIntentId.trim();
  if (!piId) {
    throw new Error("Falta el PaymentIntent de Stripe");
  }

  const payload: Stripe.RefundCreateParams = {
    payment_intent: piId,
    reason: input.reason || "requested_by_customer",
    metadata: input.metadata,
  };

  if (input.amountEuros != null) {
    const cents = Math.round(Number(input.amountEuros) * 100);
    if (cents <= 0) {
      throw new Error("El importe a devolver debe ser mayor que 0");
    }
    payload.amount = cents;
  }

  const refund = await stripe.refunds.create(payload);
  return {
    refundId: refund.id,
    amountEuros: Math.round((refund.amount || 0)) / 100,
    status: refund.status || "unknown",
    paymentIntentId: piId,
  };
}

/** Obtiene el PaymentIntent desde un Checkout Session si hace falta. */
export async function resolvePaymentIntentId(input: {
  paymentIntentId?: string;
  checkoutSessionId?: string;
}): Promise<string> {
  if (input.paymentIntentId?.trim()) return input.paymentIntentId.trim();
  const sessionId = input.checkoutSessionId?.trim();
  if (!sessionId) return "";
  const stripe = getStripe();
  if (!stripe) return "";
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id || "";
}
