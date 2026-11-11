import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import {
  collectFeaturedBlogTags,
  BlogArticleSidebar,
} from "@/components/BlogArticleSidebar";
import { getBlogPosts, getPostBySlug, getTransfersData } from "@/lib/content";
import {
  filterBlogPostsByLocale,
  blogCoverAlt,
  getBlogTopicTags,
  isBlogPostVisibleInLocale,
} from "@/lib/blog-locale";
import { blogSlugForLocale } from "@/i18n/blog-slugs";
import { formatDate } from "@/lib/format";
import { localizeBlogPost, localizeBlogPosts } from "@/lib/localize-content";
import { getDictionary } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";
import { resolveLocale } from "@/i18n/get-locale";
import { localePath } from "@/i18n/path";
import { RichContent } from "@/components/RichContent";
import {
  looksLikeHtml,
  sanitizeContentHtml,
  stripHtml,
  RICH_CONTENT_CLASS,
} from "@/lib/sanitize-html";
import { resolvePublicOrigin } from "@/lib/voucher";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = await getDictionary(locale);
  const base = await getPostBySlug(slug);
  if (!base || !isBlogPostVisibleInLocale(base, locale)) {
    return { title: dict.blog.eyebrow };
  }
  const post = await localizeBlogPost(base, locale);
  const title = post.seo?.title?.trim() || post.title;
  const description =
    post.seo?.description?.trim() || stripHtml(post.excerpt).slice(0, 180);
  const origin = resolvePublicOrigin();
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${origin}${localePath(loc, `/blog/${blogSlugForLocale(base, loc)}`)}`;
  }
  languages["x-default"] = languages.es;
  return {
    title,
    description,
    ...(post.seo?.keywords?.trim() ? { keywords: post.seo.keywords.trim() } : {}),
    alternates: { canonical: languages[locale], languages },
    openGraph: {
      title,
      description,
      type: "article",
      images: post.image ? [{ url: post.image, alt: blogCoverAlt(post) }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale: raw } = await params;
  const locale = resolveLocale(raw);
  const dict = await getDictionary(locale);
  const base = await getPostBySlug(slug);
  if (!base || !isBlogPostVisibleInLocale(base, locale)) notFound();

  const canonicalSlug = blogSlugForLocale(base, locale);
  if (slug !== canonicalSlug) {
    redirect(localePath(locale, `/blog/${canonicalSlug}`));
  }

  const post = await localizeBlogPost(base, locale);
  const [all, transfers] = await Promise.all([
    getBlogPosts().then(async (posts) =>
      localizeBlogPosts(filterBlogPostsByLocale(posts, locale), locale)
    ),
    getTransfersData(),
  ]);
  const featuredTags = collectFeaturedBlogTags(all, 14);
  const lp = (path: string) => localePath(locale, path);
  const topicTags = getBlogTopicTags(post.tags);
  const excerptHtml = looksLikeHtml(post.excerpt)
    ? sanitizeContentHtml(post.excerpt)
    : "";

  return (
    <article>
      <div className="relative flex min-h-[420px] flex-col justify-end bg-bg-deep md:min-h-[520px]">
        <Image
          src={post.image}
          alt={blogCoverAlt(post)}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/20" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pt-28 pb-10 md:px-6 md:pt-32 md:pb-12">
          {topicTags.length > 0 && (
            <div className="mb-4 flex max-h-[4.5rem] flex-wrap gap-2 overflow-hidden">
              {topicTags.slice(0, 10).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-xs font-medium text-white backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="max-w-4xl font-display text-3xl leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-white/80">
            {formatDate(post.date, locale)} · {post.author}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 lg:py-14">
        <div className="min-w-0">
          <Link
            href={lp("/blog")}
            className="inline-flex items-center gap-2 text-sm font-medium text-ocean hover:text-ocean-deep"
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.blog.eyebrow}
          </Link>
          {excerptHtml ? (
            <div
              className={`${RICH_CONTENT_CLASS} mt-8 text-lg`}
              dangerouslySetInnerHTML={{ __html: excerptHtml }}
            />
          ) : (
            <p className="mt-8 text-lg leading-relaxed text-ink-muted">{post.excerpt}</p>
          )}
          <div className="prose-blog mt-8">
            <RichContent text={post.content} className="text-base" />
          </div>
        </div>

        <BlogArticleSidebar
          locale={locale}
          dict={dict.blog}
          lp={lp}
          currentSlug={post.slug}
          posts={all}
          destinations={transfers.destinations.slice(0, 6)}
          featuredTags={featuredTags}
        />
      </div>
    </article>
  );
}
