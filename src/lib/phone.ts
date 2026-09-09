/** Country calling codes shown on public booking forms. */
export const PHONE_PREFIXES = [
  { code: "+34", region: "ES" },
  { code: "+44", region: "UK" },
  { code: "+49", region: "DE" },
  { code: "+33", region: "FR" },
  { code: "+39", region: "IT" },
  { code: "+31", region: "NL" },
  { code: "+32", region: "BE" },
  { code: "+351", region: "PT" },
  { code: "+353", region: "IE" },
  { code: "+41", region: "CH" },
  { code: "+43", region: "AT" },
  { code: "+46", region: "SE" },
  { code: "+47", region: "NO" },
  { code: "+45", region: "DK" },
  { code: "+48", region: "PL" },
  { code: "+420", region: "CZ" },
  { code: "+1", region: "US/CA" },
  { code: "+61", region: "AU" },
] as const;

export function defaultPhonePrefix(locale?: string): string {
  if (locale === "de") return "+49";
  if (locale === "en") return "+44";
  return "+34";
}

export function normalizePhonePrefix(raw?: string | null): string {
  const digits = String(raw || "").replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

export function normalizeNationalNumber(raw?: string | null): string {
  return String(raw || "").replace(/[^\d]/g, "");
}

/** Combines prefix + national number into a single stored phone, e.g. "+34 612345678". */
export function composeInternationalPhone(
  prefix?: string | null,
  national?: string | null
): string {
  const number = String(national || "").trim();
  if (!number) return "";
  if (number.startsWith("+")) {
    const compact = number.replace(/\s+/g, " ").trim();
    return compact;
  }
  const code = normalizePhonePrefix(prefix) || "+34";
  const local = normalizeNationalNumber(number);
  return local ? `${code} ${local}` : code;
}
