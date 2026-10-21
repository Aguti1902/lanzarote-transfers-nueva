import { CheckCircle2 } from "lucide-react";
import { PageBodyText } from "@/components/PageBodyText";
import { PageContentBlocks } from "@/components/PageContentBlocks";
import { PageFaqs } from "@/components/PageFaqs";
import { PageHero } from "@/components/PageHero";
import { TransferBookingForm } from "@/components/TransferBookingForm";
import { TransferRouteChips } from "@/components/TransferRouteChips";
import { DestinationGrid } from "@/components/DestinationGrid";
import type { TransferDirection } from "@/lib/transfer-price";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { SiteSettings, TransfersData } from "@/types";

export function TransfersPageView({
  locale,
  dict,
  transfers,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  transfers: TransfersData;
  settings: SiteSettings;
}) {
  const chips: { label: string; direction: TransferDirection }[] = [
    {
      label: dict.transfers.airportHotel,
      direction: "airport_to_hotel",
    },
    {
      label: dict.transfers.hotelAirport,
      direction: "hotel_to_airport",
    },
    { label: dict.transfers.roundTrip, direction: "return" },
  ];

  const faqs =
    settings.transferFaqs && settings.transferFaqs.length > 0
      ? settings.transferFaqs
      : dict.transfers.faqs.map((f, i) => ({
          id: `dict-tr-${i}`,
          question: f.q,
          answer: f.a,
        }));

  return (
    <>
      <PageHero
        image={settings.transferHeroImage}
        title={settings.transferTitle || dict.transfers.title}
        subtitle={settings.transferIntro}
        objectPosition={settings.transferHeroPosition || "50% 45%"}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
          <div className="min-w-0">
            <PageBodyText
              text={settings.transferText}
              className="!mx-0 !max-w-none !px-0 !py-0"
            />

            <TransferRouteChips chips={chips} />

            <DestinationGrid
              destinations={transfers.destinations}
              locale={locale}
              dict={dict}
            />

            <div className="mt-10">
              <h2 className="text-xl font-bold text-ink">
                {dict.transfers.advantagesTitle}
              </h2>
              {transfers.highlights.length > 0 ? (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {transfers.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 rounded-lg bg-white px-4 py-3 text-sm ring-1 ring-sand-line"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean" />
                      {h}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-ink-muted">
                  {dict.transfers.advantagesEmpty}
                </p>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <TransferBookingForm destinations={transfers.destinations} />
          </aside>
        </div>
      </section>

      <PageContentBlocks
        title={settings.transferBlocksTitle}
        intro={settings.transferBlocksIntro}
        blocks={settings.transferBlocks}
      />

      <PageFaqs
        title={settings.transferFaqTitle || dict.transfers.faqTitle}
        faqs={faqs}
        tone="soft"
      />
    </>
  );
}
