import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { getLegalPages } from "@/i18n/legal-pages";
import { resolveLocale } from "@/i18n/get-locale";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getLegalPages(locale).privacy;
  return { title: copy.title, description: copy.intro };
}

export default async function PrivacidadPage({ params }: Props) {
  const locale = resolveLocale((await params).locale);
  return <LegalDocument copy={getLegalPages(locale).privacy} locale={locale} current="privacy" />;
}
