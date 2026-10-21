import type { Metadata } from "next";
import { TransfersPageView } from "@/components/TransfersPageView";
import { loadTransfersPage } from "@/lib/load-transfers-page";
import { locales } from "@/i18n/config";
import { localePath } from "@/i18n/path";
import { resolveLocale } from "@/i18n/get-locale";
import { getDictionary } from "@/i18n/dictionaries";
import { getSettings } from "@/lib/content";
import { localizeSettings } from "@/lib/localize-content";
import { resolvePublicOrigin } from "@/lib/voucher";

export const revalidate = 60;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const dict = await getDictionary(locale);
  const settings = await localizeSettings(await getSettings(), locale);
  const origin = resolvePublicOrigin();
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[loc] = `${origin}${localePath(loc, "/traslados")}`;
  }
  languages["x-default"] = languages.es;
  return {
    title: settings.transferTitle || dict.transfers.title,
    alternates: {
      canonical: languages[locale],
      languages,
    },
  };
}

export default async function TrasladosPage({ params }: Props) {
  const data = await loadTransfersPage((await params).locale);
  return <TransfersPageView {...data} />;
}
