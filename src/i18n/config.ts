export const locales = ["es", "en", "de", "fr"] as const;
export type Locale = (typeof locales)[number];
/** Idiomas con overlay de contenido (el español es la base). */
export type ContentLocale = Exclude<Locale, "es">;
export const contentLocales: ContentLocale[] = ["en", "de", "fr"];
export const defaultLocale: Locale = "es";

export const localeLabels: Record<Locale, string> = {
  es: "Español",
  en: "English",
  de: "Deutsch",
  fr: "Français",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
