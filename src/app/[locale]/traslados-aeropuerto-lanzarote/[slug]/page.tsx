import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationSheet } from "@/components/DestinationSheet";
import { TransfersPageView } from "@/components/TransfersPageView";
import { loadTransfersPage } from "@/lib/load-transfers-page";
import { localePath } from "@/i18n/path";
import { resolvePublicOrigin } from "@/lib/voucher";
import { locales } from "@/i18n/config";
import {
  destinationPublicPath,
  getDestinationCopy,
} from "@/lib/destination-copy";

export const revalidate = 60;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const { locale, transfers } = await loadTransfersPage(raw);
  const dest = transfers.destinations.find((d) => d.slug === slug || d.id === slug);
  if (!dest) return {};
  const copy = getDestinationCopy(dest, locale);
  const origin = resolvePublicOrigin();
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const publicPath = destinationPublicPath(dest, loc);
    languages[loc] = publicPath.startsWith("/traslados")
      ? `${origin}${localePath(loc, publicPath)}`
      : `${origin}/${loc}${publicPath}`;
  }
  return {
    title: copy?.seoTitle || dest.name,
    description: copy?.seoDescription,
    alternates: {
      canonical: languages[locale],
      languages,
    },
  };
}

export default async function DestinationPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const data = await loadTransfersPage(raw);
  const dest = data.transfers.destinations.find(
    (d) => d.slug === slug || d.id === slug
  );
  if (!dest) notFound();

  return (
    <>
      <TransfersPageView {...data} />
      <DestinationSheet
        destination={dest}
        destinations={data.transfers.destinations}
        closedDates={data.transfers.closedDates || []}
      />
    </>
  );
}
