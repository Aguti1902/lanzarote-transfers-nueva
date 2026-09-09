import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";
import { getDictionarySync } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { LegalPageCopy } from "@/i18n/legal-pages";
import { localePath } from "@/i18n/path";

export function LegalDocument({
  copy,
  locale,
  current,
}: {
  copy: LegalPageCopy;
  locale: Locale;
  current: "privacy" | "terms" | "cookies";
}) {
  const dict = getDictionarySync(locale);
  const links = [
    {
      id: "privacy" as const,
      href: localePath(locale, "/privacidad"),
      label: dict.footer.privacy,
    },
    {
      id: "terms" as const,
      href: localePath(locale, "/condiciones"),
      label: dict.footer.terms,
    },
    {
      id: "cookies" as const,
      href: localePath(locale, "/cookies"),
      label: dict.footer.cookies,
    },
  ];

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <div className="relative mb-8 h-12 w-[220px] md:h-14 md:w-[260px]">
        <BrandLogo variant="onLight" className="h-full w-full" sizes="260px" />
      </div>
      <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">
        {copy.title}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">{copy.updated}</p>
      <p className="mt-6 text-base leading-relaxed text-ink">{copy.intro}</p>
      <div className="mt-10 space-y-8">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-bold text-ink">{section.heading}</h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={`${section.heading}-${index}`}
                className="mt-3 text-[15px] leading-relaxed text-ink/90"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
      <nav className="mt-12 flex flex-wrap gap-4 border-t border-sand-line pt-6 text-sm font-medium text-ocean">
        {links
          .filter((link) => link.id !== current)
          .map((link) => (
            <Link key={link.id} href={link.href} className="hover:underline">
              {link.label}
            </Link>
          ))}
      </nav>
    </article>
  );
}
