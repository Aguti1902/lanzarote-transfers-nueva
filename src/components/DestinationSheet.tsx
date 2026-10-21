"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { TransferBookingForm } from "@/components/TransferBookingForm";
import { RichContent } from "@/components/RichContent";
import { useLocale } from "@/components/LocaleProvider";
import { formatPrice } from "@/lib/format";
import { destinationCover } from "@/lib/destination-images";
import { getDestinationCopy } from "@/lib/destination-copy";
import type { TransferDestination } from "@/types";

export function DestinationSheet({
  destination,
  destinations,
}: {
  destination: TransferDestination;
  destinations: TransferDestination[];
}) {
  const router = useRouter();
  const { dict, href, locale } = useLocale();
  const copy = getDestinationCopy(destination, locale);

  function close() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(href("/traslados"));
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]"
        aria-label={dict.common.close}
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
      >
        <div className="relative aspect-[16/7] min-h-[160px]">
          <Image
            src={destinationCover(destination)}
            alt={copy?.headline || destination.name}
            fill
            className="object-cover"
            sizes="1024px"
            priority
          />
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink shadow hover:bg-white"
            aria-label={dict.common.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-6 p-5 md:grid-cols-[minmax(0,1fr)_320px] md:p-7">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.16em] text-ocean uppercase">
              {dict.transfers.destinationsKicker}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight text-ink md:text-4xl">
              {copy?.headline || destination.name}
            </h1>
            {copy?.tagline ? (
              <p className="mt-2 text-lg italic text-ocean">{copy.tagline}</p>
            ) : (
              <p className="mt-2 text-sm text-ink-muted">
                {[destination.duration, destination.distance]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
            {copy?.html ? (
              <RichContent
                text={copy.html}
                className="mt-5 !space-y-3 text-base [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:my-1"
              />
            ) : destination.description ? (
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {destination.description}
              </p>
            ) : (
              <p className="mt-4 text-base leading-relaxed text-ink-muted">
                {dict.transfers.bookThis}: ACE ↔ {destination.name}.
              </p>
            )}
            <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-sky-soft px-3 py-3">
                <dt className="text-ink-muted">{dict.transfers.oneWay}</dt>
                <dd className="mt-1 font-bold text-ocean">
                  {formatPrice(destination.priceOneWay)}
                </dd>
              </div>
              <div className="rounded-lg bg-sky-soft px-3 py-3">
                <dt className="text-ink-muted">{dict.transfers.return}</dt>
                <dd className="mt-1 font-bold text-ocean">
                  {formatPrice(destination.priceReturn)}
                </dd>
              </div>
              <div className="rounded-lg bg-sky-soft px-3 py-3">
                <dt className="text-ink-muted">{dict.transfers.extraPerson}</dt>
                <dd className="mt-1 font-bold text-ocean">
                  {formatPrice(destination.priceExtraPerson ?? 10)}
                </dd>
              </div>
            </dl>
          </div>
          <div className="md:sticky md:top-4 md:self-start">
            <TransferBookingForm
              destinations={destinations}
              defaultDestinationId={destination.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
