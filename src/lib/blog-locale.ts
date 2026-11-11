import type { Locale } from "@/i18n/config";
import { contentLocales, locales } from "@/i18n/config";
import { normalizeBlogSlug } from "@/i18n/blog-slugs";
import type { BlogPost, BlogPostTranslation, BlogSeo } from "@/types";

const LOCALE_TAGS = new Set<string>(locales);

function hasTranslationContent(block: BlogPostTranslation | undefined): boolean {
  if (!block) return false;
  return Boolean(
    block.title?.trim() ||
      block.excerpt?.trim() ||
      block.content?.trim() ||
      block.author?.trim() ||
      block.imageAlt?.trim() ||
      block.slug?.trim() ||
      block.seo?.title?.trim() ||
      block.seo?.description?.trim() ||
      block.seo?.keywords?.trim()
  );
}

export function normalizeBlogSeo(seo: BlogSeo | undefined): BlogSeo | undefined {
  if (!seo || typeof seo !== "object") return undefined;
  const next: BlogSeo = {
    ...(seo.title?.trim() ? { title: seo.title.trim() } : {}),
    ...(seo.description?.trim() ? { description: seo.description.trim() } : {}),
    ...(seo.keywords?.trim() ? { keywords: seo.keywords.trim() } : {}),
  };
  return Object.keys(next).length ? next : undefined;
}

export function getBlogLanguageTag(
  post: Pick<BlogPost, "tags">
): Locale | null {
  const tag = (post.tags || []).find((t) => LOCALE_TAGS.has(t));
  return (tag as Locale) || null;
}

export function getBlogPostLocale(post: Pick<BlogPost, "tags">): Locale {
  return getBlogLanguageTag(post) || "es";
}

export function isPrimaryBlogPost(
  post: Pick<BlogPost, "tags" | "translations">
): boolean {
  if (contentLocales.some((locale) => hasTranslationContent(post.translations?.[locale]))) {
    return true;
  }
  const tag = getBlogLanguageTag(post);
  return !tag || tag === "es";
}

export function isBlogPostPublished(post: Pick<BlogPost, "published">): boolean {
  return post.published !== false;
}

export function isBlogPostVisibleInLocale(
  post: Pick<BlogPost, "tags" | "translations" | "published">,
  locale: Locale
): boolean {
  if (!isBlogPostPublished(post)) return false;
  if (isPrimaryBlogPost(post)) return true;
  return getBlogPostLocale(post) === locale;
}

export function filterBlogPostsByLocale(posts: BlogPost[], locale: Locale): BlogPost[] {
  return posts.filter((post) => isBlogPostVisibleInLocale(post, locale));
}

export function getBlogTopicTags(tags: string[] | undefined): string[] {
  return (tags || []).filter((t) => !LOCALE_TAGS.has(t));
}

export function normalizeBlogTranslations(
  translations: BlogPost["translations"] | undefined
): BlogPost["translations"] | undefined {
  if (!translations || typeof translations !== "object") return undefined;
  const next: NonNullable<BlogPost["translations"]> = {};
  for (const locale of contentLocales) {
    const block = translations[locale];
    if (!hasTranslationContent(block)) continue;
    const seo = normalizeBlogSeo(block?.seo);
    const slug = block?.slug?.trim() ? normalizeBlogSlug(block.slug) : "";
    const tags = getBlogTopicTags(block?.tags);
    next[locale] = {
      ...(slug ? { slug } : {}),
      ...(block?.title?.trim() ? { title: block.title } : {}),
      ...(block?.excerpt?.trim() ? { excerpt: block.excerpt } : {}),
      ...(block?.content?.trim() ? { content: block.content } : {}),
      ...(block?.author?.trim() ? { author: block.author } : {}),
      ...(tags.length ? { tags } : {}),
      ...(block?.imageAlt?.trim() ? { imageAlt: block.imageAlt.trim() } : {}),
      ...(seo ? { seo } : {}),
    };
  }
  return Object.keys(next).length ? next : undefined;
}

export function getBlogPostLanguageCoverage(post: BlogPost): Locale[] {
  const covered: Locale[] = [];
  if (isPrimaryBlogPost(post)) {
    if (post.title?.trim() || post.content?.trim()) covered.push("es");
    for (const locale of contentLocales) {
      if (hasTranslationContent(post.translations?.[locale])) covered.push(locale);
    }
    return covered.length ? covered : ["es"];
  }
  return [getBlogPostLocale(post)];
}

export function blogCoverAlt(post: Pick<BlogPost, "title" | "imageAlt">): string {
  return (post.imageAlt || "").trim() || post.title || "Blog";
}
