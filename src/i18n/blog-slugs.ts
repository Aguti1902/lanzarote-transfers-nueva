import { contentLocales, type ContentLocale, type Locale } from "./config";

export type BlogSlugSource = {
  slug: string;
  translations?: Partial<Record<ContentLocale, { slug?: string }>>;
};

export function normalizeBlogSlug(slug: string): string {
  return slug
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Slug público del artículo. Si EN/DE/FR está vacío, se usa el slug en español. */
export function blogSlugForLocale(post: BlogSlugSource, locale: Locale): string {
  if (locale !== "es") {
    const s = post.translations?.[locale]?.slug?.trim();
    if (s) return normalizeBlogSlug(s);
  }
  return normalizeBlogSlug(post.slug) || post.slug;
}

export function blogMatchesSlug(post: BlogSlugSource, slug: string): boolean {
  const key = normalizeBlogSlug(slug);
  if (!key) return false;
  if (normalizeBlogSlug(post.slug) === key) return true;
  for (const locale of contentLocales) {
    if (normalizeBlogSlug(post.translations?.[locale]?.slug || "") === key) {
      return true;
    }
  }
  return false;
}

export function blogAllSlugs(post: BlogSlugSource): string[] {
  const out = new Set<string>();
  const base = normalizeBlogSlug(post.slug);
  if (base) out.add(base);
  for (const locale of contentLocales) {
    const s = normalizeBlogSlug(post.translations?.[locale]?.slug || "");
    if (s) out.add(s);
  }
  return [...out];
}
