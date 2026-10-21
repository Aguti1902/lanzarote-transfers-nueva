import type {
  Booking,
  Collaborator,
  CruiseGroup,
  CruisePort,
  CustomerFeedback,
  Invoice,
  PaymentLink,
  SeoRedirect,
  SiteSettings,
  TransferDestination,
  TransfersData,
} from "@/types";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  warnSupabaseFallback,
} from "@/lib/supabase/client";
import {
  bookingToRow,
  invoiceToRow,
  rowToBooking,
  rowToInvoice,
} from "@/lib/supabase/mappers";
type AdminExtrasData = {
  paymentLinks: PaymentLink[];
  collaborators: Collaborator[];
  feedback: CustomerFeedback[];
  cruisePorts: CruisePort[];
  cruiseGroups: CruiseGroup[];
  redirects: SeoRedirect[];
  cruiseGroupsResetAt?: string;
};

type TravelerReview = {
  id: string;
  tourId?: string | null;
  author: string;
  title?: string | null;
  text: string;
  rating: number;
  ratingScale?: number;
  locale?: string;
  date?: string | null;
  source?: string;
  featured?: boolean;
};

type TripadvisorMeta = {
  url: string;
  rating: number;
  reviewCount: number;
  locationId?: string;
  name?: string;
};

type ReviewsData = {
  tripadvisor: TripadvisorMeta;
  reviews: TravelerReview[];
};

type UiTranslationOverrides = {
  es: Record<string, string>;
  en: Record<string, string>;
  de: Record<string, string>;
};

type TranslatedLocale = "en" | "de";
type ContentTranslations = Record<string, unknown>;

function useDb(): boolean {
  return isSupabaseConfigured();
}

async function runDb<T>(
  context: string,
  fn: () => Promise<T>
): Promise<T | null> {
  if (!useDb()) return null;
  try {
    return await fn();
  } catch (error) {
    warnSupabaseFallback(context, error as Error);
    return null;
  }
}

/* ── Bookings ── */

export async function dbListBookings(): Promise<Booking[] | null> {
  return runDb("bookings-list", async () => {
    const { data, error } = await getSupabaseAdmin()
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => rowToBooking(row as Record<string, unknown>));
  });
}

export async function dbSaveBookings(bookings: Booking[]): Promise<boolean> {
  const ok = await runDb("bookings-save", async () => {
    const sb = getSupabaseAdmin();
    const { data: existing, error: readError } = await sb
      .from("bookings")
      .select("id");
    if (readError) throw readError;
    const keep = new Set(bookings.map((b) => b.id));
    const toDelete = (existing ?? [])
      .map((row) => String((row as { id: string }).id))
      .filter((id) => !keep.has(id));
    if (toDelete.length) {
      const { error } = await sb.from("bookings").delete().in("id", toDelete);
      if (error) throw error;
    }
    if (bookings.length) {
      const { error } = await sb
        .from("bookings")
        .upsert(bookings.map(bookingToRow), { onConflict: "id" });
      if (error) throw error;
    }
    return true;
  });
  return ok === true;
}

/* ── Invoices ── */

export async function dbListInvoices(): Promise<Invoice[] | null> {
  return runDb("invoices-list", async () => {
    const { data, error } = await getSupabaseAdmin()
      .from("invoices")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((row) => rowToInvoice(row as Record<string, unknown>));
  });
}

export async function dbSaveInvoices(invoices: Invoice[]): Promise<boolean> {
  const ok = await runDb("invoices-save", async () => {
    const sb = getSupabaseAdmin();
    const { data: existing, error: readError } = await sb
      .from("invoices")
      .select("id");
    if (readError) throw readError;
    const keep = new Set(invoices.map((i) => i.id));
    const toDelete = (existing ?? [])
      .map((row) => String((row as { id: string }).id))
      .filter((id) => !keep.has(id));
    if (toDelete.length) {
      const { error } = await sb.from("invoices").delete().in("id", toDelete);
      if (error) throw error;
    }
    if (invoices.length) {
      const { error } = await sb
        .from("invoices")
        .upsert(invoices.map(invoiceToRow), { onConflict: "id" });
      if (error) throw error;
    }
    return true;
  });
  return ok === true;
}

/* ── Transfers ── */

function destToRow(dest: TransferDestination, index: number) {
  return {
    id: dest.id,
    name: dest.name,
    slug: dest.slug,
    price_one_way: dest.priceOneWay,
    price_return: dest.priceReturn,
    price_extra_person: dest.priceExtraPerson ?? 10,
    duration: dest.duration,
    distance: dest.distance,
    image: dest.image ?? "",
    description: dest.description ?? "",
    sort_order: index,
    active: true,
  };
}

function rowToDest(row: Record<string, unknown>): TransferDestination {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    priceOneWay: Number(row.price_one_way) || 0,
    priceReturn: Number(row.price_return) || 0,
    priceExtraPerson: Number(row.price_extra_person) || 10,
    duration: String(row.duration || ""),
    distance: String(row.distance || ""),
    image: String(row.image || ""),
    description: String(row.description || ""),
  };
}

export async function dbGetTransfers(): Promise<TransfersData | null> {
  return runDb("transfers-get", async () => {
    const sb = getSupabaseAdmin();
    const [{ data: dests, error: destError }, { data: meta, error: metaError }] =
      await Promise.all([
        sb.from("transfer_destinations").select("*").order("sort_order"),
        sb.from("transfer_meta").select("highlights").eq("id", 1).maybeSingle(),
      ]);
    if (destError) throw destError;
    if (metaError) throw metaError;
    if (!dests?.length) return null;
    return {
      destinations: dests.map((row) => rowToDest(row as Record<string, unknown>)),
      highlights: (meta?.highlights as string[]) || [],
    };
  });
}

export async function dbSaveTransferHighlights(
  highlights: string[]
): Promise<boolean> {
  const ok = await runDb("transfer-highlights-save", async () => {
    const payload = {
      id: 1,
      highlights: highlights ?? [],
      updated_at: new Date().toISOString(),
    };
    let { error } = await getSupabaseAdmin()
      .from("transfer_meta")
      .upsert(payload, { onConflict: "id" });
    if (error && /updated_at/i.test(error.message)) {
      const { updated_at: _updatedAt, ...slim } = payload;
      ({ error } = await getSupabaseAdmin()
        .from("transfer_meta")
        .upsert(slim, { onConflict: "id" }));
    }
    if (error) throw error;
    return true;
  });
  return ok === true;
}

export async function dbSaveTransfers(data: TransfersData): Promise<boolean> {
  const ok = await runDb("transfers-save", async () => {
    const sb = getSupabaseAdmin();
    const { data: existing, error: readError } = await sb
      .from("transfer_destinations")
      .select("id");
    if (readError) throw readError;
    const keep = new Set(data.destinations.map((d) => d.id));
    const toDelete = (existing ?? [])
      .map((row) => String((row as { id: string }).id))
      .filter((id) => !keep.has(id));
    if (toDelete.length) {
      const { error } = await sb
        .from("transfer_destinations")
        .delete()
        .in("id", toDelete);
      if (error) throw error;
    }
    if (data.destinations.length) {
      const rows = data.destinations.map((dest, index) =>
        destToRow(dest, index)
      );
      let { error } = await sb
        .from("transfer_destinations")
        .upsert(rows, { onConflict: "id" });
      if (error && /image|description/i.test(error.message)) {
        const slim = rows.map(
          ({ image: _image, description: _description, ...rest }) => rest
        );
        ({ error } = await sb
          .from("transfer_destinations")
          .upsert(slim, { onConflict: "id" }));
      }
      if (error) throw error;
    }
    const { error: metaError } = await sb.from("transfer_meta").upsert(
      {
        id: 1,
        highlights: data.highlights ?? [],
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (metaError) throw metaError;
    return true;
  });
  return ok === true;
}

/* ── Settings ── */

export async function dbGetSettings(): Promise<Partial<SiteSettings> | null> {
  return runDb("settings-get", async () => {
    const { data, error } = await getSupabaseAdmin()
      .from("site_settings")
      .select("data")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    if (!data?.data || typeof data.data !== "object") return null;
    return data.data as Partial<SiteSettings>;
  });
}

export async function dbSaveSettings(settings: SiteSettings): Promise<boolean> {
  const ok = await runDb("settings-save", async () => {
    const { error } = await getSupabaseAdmin().from("site_settings").upsert(
      {
        id: 1,
        data: settings,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) throw error;
    return true;
  });
  return ok === true;
}

/* ── Admin extras ── */

type ExtraTable =
  | "payment_links"
  | "collaborators"
  | "customer_feedback"
  | "cruise_ports"
  | "cruise_groups"
  | "seo_redirects";

async function listExtra<T extends { id: string }>(
  table: ExtraTable
): Promise<T[]> {
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .select("id, data");
  if (error) throw error;
  return (data ?? []).map((row) => {
    const payload = (row as { data: T }).data;
    return { ...payload, id: String((row as { id: string }).id) };
  });
}

async function replaceExtra<T extends { id: string }>(
  table: ExtraTable,
  items: T[]
): Promise<void> {
  const sb = getSupabaseAdmin();
  const { data: existing, error: readError } = await sb.from(table).select("id");
  if (readError) throw readError;
  const keep = new Set(items.map((item) => item.id));
  const toDelete = (existing ?? [])
    .map((row) => String((row as { id: string }).id))
    .filter((id) => !keep.has(id));
  if (toDelete.length) {
    const { error } = await sb.from(table).delete().in("id", toDelete);
    if (error) throw error;
  }
  if (items.length) {
    const { error } = await sb
      .from(table)
      .upsert(
        items.map((item) => ({ id: item.id, data: item })),
        { onConflict: "id" }
      );
    if (error) throw error;
  }
}

export async function dbGetAdminExtras(): Promise<AdminExtrasData | null> {
  return runDb("admin-extras-get", async () => {
    const [
      paymentLinks,
      collaborators,
      feedback,
      cruisePorts,
      cruiseGroups,
      redirects,
    ] = await Promise.all([
      listExtra<PaymentLink>("payment_links"),
      listExtra<Collaborator>("collaborators"),
      listExtra<CustomerFeedback>("customer_feedback"),
      listExtra<CruisePort>("cruise_ports"),
      listExtra<CruiseGroup>("cruise_groups"),
      listExtra<SeoRedirect>("seo_redirects"),
    ]);
    return {
      paymentLinks,
      collaborators,
      feedback,
      cruisePorts,
      cruiseGroups,
      redirects,
    };
  });
}

export async function dbSaveAdminExtras(
  data: AdminExtrasData
): Promise<boolean> {
  const ok = await runDb("admin-extras-save", async () => {
    await Promise.all([
      replaceExtra("payment_links", data.paymentLinks),
      replaceExtra("collaborators", data.collaborators),
      replaceExtra("customer_feedback", data.feedback),
      replaceExtra("cruise_ports", data.cruisePorts),
      replaceExtra("cruise_groups", data.cruiseGroups),
      replaceExtra("seo_redirects", data.redirects),
    ]);
    return true;
  });
  return ok === true;
}

/* ── Contact ── */

export async function dbInsertContactMessage(entry: {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale?: string;
}): Promise<boolean> {
  const ok = await runDb("contact-insert", async () => {
    const { error } = await getSupabaseAdmin().from("contact_messages").insert({
      id: entry.id,
      created_at: entry.createdAt,
      name: entry.name,
      email: entry.email,
      phone: entry.phone ?? null,
      message: entry.message,
      locale: entry.locale ?? null,
    });
    if (error) throw error;
    return true;
  });
  return ok === true;
}

/* ── Reviews ── */

function rowToReview(row: Record<string, unknown>): TravelerReview {
  return {
    id: String(row.id),
    tourId: (row.tour_id as string) || null,
    author: String(row.author),
    title: (row.title as string) || null,
    text: String(row.body ?? ""),
    rating: Number(row.rating) || 0,
    ratingScale: Number(row.rating_scale) || 5,
    locale: (row.locale as string) || undefined,
    date: row.review_date ? String(row.review_date).slice(0, 10) : null,
    source: (row.source as TravelerReview["source"]) || undefined,
    featured: Boolean(row.featured),
  };
}

export async function dbGetReviews(): Promise<ReviewsData | null> {
  return runDb("reviews-get", async () => {
    const sb = getSupabaseAdmin();
    const [{ data: reviews, error: reviewError }, { data: meta, error: metaError }] =
      await Promise.all([
        sb.from("reviews").select("*"),
        sb.from("tripadvisor_meta").select("*").eq("id", 1).maybeSingle(),
      ]);
    if (reviewError) throw reviewError;
    if (metaError) throw metaError;
    if (!reviews?.length) return null;
    const tripadvisor: TripadvisorMeta = {
      url: String(meta?.url || ""),
      rating: Number(meta?.rating) || 0,
      reviewCount: Number(meta?.review_count) || 0,
      locationId: (meta?.location_id as string) || undefined,
      name: (meta?.name as string) || undefined,
    };
    return {
      tripadvisor,
      reviews: reviews.map((row) => rowToReview(row as Record<string, unknown>)),
    };
  });
}

/* ── UI + content translations ── */

export async function dbGetUiTranslations(): Promise<UiTranslationOverrides | null> {
  return runDb("ui-translations-get", async () => {
    const { data, error } = await getSupabaseAdmin()
      .from("ui_translation_overrides")
      .select("locale, data");
    if (error) throw error;
    if (!data?.length) return null;
    const next: UiTranslationOverrides = { es: {}, en: {}, de: {} };
    for (const row of data) {
      const locale = String((row as { locale: string }).locale);
      if (locale === "es" || locale === "en" || locale === "de") {
        next[locale] = ((row as { data: Record<string, string> }).data) || {};
      }
    }
    return next;
  });
}

export async function dbSaveUiTranslations(
  data: UiTranslationOverrides
): Promise<boolean> {
  const ok = await runDb("ui-translations-save", async () => {
    const { error } = await getSupabaseAdmin().from("ui_translation_overrides").upsert(
      [
        { locale: "es", data: data.es || {} },
        { locale: "en", data: data.en || {} },
        { locale: "de", data: data.de || {} },
      ],
      { onConflict: "locale" }
    );
    if (error) throw error;
    return true;
  });
  return ok === true;
}

export async function dbGetContentTranslations(
  locale: TranslatedLocale
): Promise<ContentTranslations | null> {
  return runDb(`content-translations-get-${locale}`, async () => {
    const { data, error } = await getSupabaseAdmin()
      .from("content_translations")
      .select("data")
      .eq("locale", locale)
      .maybeSingle();
    if (error) throw error;
    if (!data?.data || typeof data.data !== "object") return null;
    return data.data as ContentTranslations;
  });
}

export async function dbSaveContentTranslations(
  locale: TranslatedLocale,
  data: unknown
): Promise<boolean> {
  const ok = await runDb(`content-translations-save-${locale}`, async () => {
    const { error } = await getSupabaseAdmin()
      .from("content_translations")
      .upsert({ locale, data }, { onConflict: "locale" });
    if (error) throw error;
    return true;
  });
  return ok === true;
}
