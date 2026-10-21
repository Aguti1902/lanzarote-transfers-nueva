import { NextResponse } from "next/server";
import { isLocale, type Locale } from "@/i18n/config";
import {
  getContentTranslations,
  patchSettingsTranslations,
  patchTransfersTranslations,
} from "@/lib/localize-content";
import { pickSettingsTranslations } from "@/lib/settings-i18n";
import type { SiteSettings } from "@/types";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") || "en";
  if (!isLocale(localeParam) || localeParam === "es") {
    return NextResponse.json(
      { error: "locale debe ser en o de" },
      { status: 400 }
    );
  }
  const locale = localeParam as Exclude<Locale, "es">;
  const data = await getContentTranslations(locale);
  return NextResponse.json({
    locale,
    settings: pickSettingsTranslations(data.settings),
    transfers: data.transfers || { highlights: [] },
  });
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const body = await request.json();
    const locale = body.locale as string;
    if (!isLocale(locale) || locale === "es") {
      return NextResponse.json(
        { error: "locale debe ser en o de" },
        { status: 400 }
      );
    }
    const loc = locale as Exclude<Locale, "es">;
    if (body.transfers) {
      const data = await patchTransfersTranslations(loc, body.transfers);
      return NextResponse.json({
        ok: true,
        locale,
        transfers: data.transfers,
      });
    }
    const settings = (body.settings || {}) as Partial<SiteSettings>;
    const data = await patchSettingsTranslations(loc, settings);
    return NextResponse.json({
      ok: true,
      locale,
      settings: pickSettingsTranslations(data.settings),
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron guardar las traducciones" },
      { status: 500 }
    );
  }
}
