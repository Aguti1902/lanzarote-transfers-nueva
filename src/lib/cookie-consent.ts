export const COOKIE_CONSENT_KEY = "lt_cookie_consent";
export const COOKIE_CONSENT_EVENT = "lt-cookie-consent";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

export type CookieConsent = {
  version: 1;
  optional: boolean;
  at: number;
};

function parseConsent(raw: string | null | undefined): CookieConsent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<CookieConsent>;
    if (value?.version !== 1 || typeof value.optional !== "boolean") return null;
    return {
      version: 1,
      optional: value.optional,
      at: typeof value.at === "number" ? value.at : Date.now(),
    };
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  const prefix = `${name}=`;
  const match = parts.find((part) => part.startsWith(prefix));
  if (!match) return null;
  return decodeURIComponent(match.slice(prefix.length));
}

export function readCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  return (
    parseConsent(window.localStorage.getItem(COOKIE_CONSENT_KEY)) ||
    parseConsent(readCookie(COOKIE_CONSENT_KEY))
  );
}

export function writeCookieConsent(optional: boolean): CookieConsent {
  const consent: CookieConsent = {
    version: 1,
    optional,
    at: Date.now(),
  };
  const encoded = JSON.stringify(consent);
  window.localStorage.setItem(COOKIE_CONSENT_KEY, encoded);
  document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(encoded)}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE}; SameSite=Lax`;
  document.documentElement.dataset.optionalCookies = optional ? "1" : "0";
  window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function applyCookieConsent(consent: CookieConsent | null) {
  document.documentElement.dataset.optionalCookies = consent?.optional
    ? "1"
    : "0";
}
