import Image from "next/image";
import Link from "next/link";
import type { TransferDestination } from "@/types";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/path";
import { formatPrice } from "@/lib/format";
import { destinationCover } from "@/lib/destination-images";

export function DestinationGrid({
  destinations,
  locale,
  dict,
}: {
  destinations: TransferDestination[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (!destinations.length) return null;

  return (
    <details
      open
      className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-sand-line"
    >
      <summary className="cursor-pointer list-none px-4 py-4 marker:content-none [&::-webkit-details-marker]:hidden md:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-ocean uppercase">
              {dict.transfers.destinationsKicker}
            </p>
            <h2 className="mt-1 text-xl font-bold text-ink md:text-2xl">
              {dict.transfers.destinationsTitle}
            </h2>
          </div>
          <span className="rounded-full bg-sky-soft px-3 py-1 text-sm font-semibold text-ocean">
            {destinations.length}
          </span>
        </div>
      </summary>
      <div className="grid gap-4 border-t border-sand-line p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-5">
        {destinations.map((dest) => {
          const href = localePath(
            locale,
            `/traslados-aeropuerto-lanzarote/${dest.slug}`
          );
          return (
            <Link
              key={dest.id}
              href={href}
              className="group overflow-hidden rounded-xl bg-sky-soft/40 ring-1 ring-sand-line transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={destinationCover(dest)}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl text-ink">{dest.name}</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {[dest.duration, dest.distance].filter(Boolean).join(" · ")}
                </p>
                <p className="mt-3 text-lg font-bold text-ocean">
                  {dict.common.from} {formatPrice(dest.priceOneWay)}
                </p>
                <p className="mt-2 text-sm font-semibold text-ocean">
                  {dict.transfers.viewDestination} →
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </details>
  );
}
