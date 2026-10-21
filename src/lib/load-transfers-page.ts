import { getSettings, getTransfersData } from "@/lib/content";
import { localizeSettings, localizeTransfers } from "@/lib/localize-content";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveLocale } from "@/i18n/get-locale";
import { getDestinationCopy } from "@/lib/destination-copy";
import type { Locale } from "@/i18n/config";

export async function loadTransfersPage(rawLocale: string) {
  const locale = resolveLocale(rawLocale);
  const dict = await getDictionary(locale);
  const [transfers, settings] = await Promise.all([
    getTransfersData().then((data) => localizeTransfers(data, locale)),
    getSettings().then((s) => localizeSettings(s, locale)),
  ]);
  return {
    locale: locale as Locale,
    dict,
    transfers: {
      ...transfers,
      destinations: transfers.destinations.map((dest) => {
        const copy = getDestinationCopy(dest, locale);
        if (!copy || dest.description?.trim()) return dest;
        return { ...dest, description: copy.html };
      }),
    },
    settings,
  };
}
