import { notFound } from "next/navigation";
import { DestinationSheet } from "@/components/DestinationSheet";
import { loadTransfersPage } from "@/lib/load-transfers-page";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function DestinationModalPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const data = await loadTransfersPage(raw);
  const dest = data.transfers.destinations.find(
    (d) => d.slug === slug || d.id === slug
  );
  if (!dest) notFound();

  return (
    <DestinationSheet
      destination={dest}
      destinations={data.transfers.destinations}
      closedDates={data.transfers.closedDates || []}
    />
  );
}
