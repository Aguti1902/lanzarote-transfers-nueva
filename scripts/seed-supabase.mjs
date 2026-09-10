/**
 * Semilla de un proyecto Supabase nuevo:
 *   buckets uploads (público) + cms (privado, backup)
 *   destinos, highlights, settings, reseñas y traducciones
 *   extras (pagos/colaboradores/feedback/redirects) solo si la tabla está vacía
 * No pisa reservas, facturas ni mensajes.
 *
 *   ALLOW_CMS_SEED=1 npm run seed:supabase
 * Backup JSON opcional: ALLOW_CMS_SEED_STORAGE=1
 */
import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (process.env.ALLOW_CMS_SEED !== "1") {
  console.error(
    "Refusado: seed desactivado por seguridad.\n" +
      "Para sembrar un proyecto vacío:\n" +
      "  ALLOW_CMS_SEED=1 npm run seed:supabase"
  );
  process.exit(1);
}

/** Misma lista que src/lib/cms-files.ts: no pisar datos vivos del panel. */
const PROTECTED_LIVE_CMS = new Set([
  "bookings.json",
  "invoices.json",
  "messages.json",
  "tours.json",
  "settings.json",
  "transfers.json",
  "blog.json",
  "houses.json",
  "cruises.json",
  "cruiseItineraries.json",
  "cruiseCompanies.json",
  "cruisePortIndex.json",
  "shoreTours.json",
  "adminExtras.json",
  "uiTranslations.json",
  "i18n/en.json",
  "i18n/de.json",
]);
const overwriteProtected = process.env.ALLOW_CMS_SEED_PROTECTED === "1";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error(
    "Define NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY antes de ejecutar el seed."
  );
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "src", "data");
const CMS_BUCKET = "cms";

async function readJson(file) {
  const raw = await readFile(path.join(dataDir, file), "utf-8");
  return JSON.parse(raw);
}

async function ensureBucket(name, options) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === name)) return;
  const { error } = await supabase.storage.createBucket(name, options);
  if (error && !/already exists|duplicate/i.test(error.message)) {
    throw error;
  }
}

async function uploadCmsFile(relativePath) {
  const full = path.join(dataDir, relativePath);
  const raw = await readFile(full);
  const options = {
    upsert: true,
    contentType: "application/json",
    cacheControl: "0",
  };
  // update es más fiable con ficheros grandes ya existentes
  const updated = await supabase.storage
    .from(CMS_BUCKET)
    .update(relativePath, raw, options);
  if (updated.error) {
    const { error } = await supabase.storage
      .from(CMS_BUCKET)
      .upload(relativePath, raw, options);
    if (error) throw new Error(`cms/${relativePath}: ${error.message}`);
  }
  console.log(`cms/${relativePath} (${raw.byteLength} bytes)`);
}

async function uploadAllCmsJson() {
  await ensureBucket(CMS_BUCKET, {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024,
  });
  await ensureBucket("uploads", {
    public: true,
    fileSizeLimit: 6 * 1024 * 1024,
  });

  const files = await readdir(dataDir);
  for (const name of files) {
    if (name.endsWith(".json")) {
      if (!overwriteProtected && PROTECTED_LIVE_CMS.has(name)) {
        console.log(`cms/${name} omitido (protegido; ALLOW_CMS_SEED_PROTECTED=1 para forzar)`);
        continue;
      }
      await uploadCmsFile(name);
    }
  }

  const i18nDir = path.join(dataDir, "i18n");
  try {
    const locales = await readdir(i18nDir);
    for (const name of locales) {
      if (name.endsWith(".json")) {
        const relative = path.join("i18n", name);
        if (!overwriteProtected && PROTECTED_LIVE_CMS.has(relative.replaceAll("\\", "/"))) {
          console.log(`cms/${relative} omitido (protegido; ALLOW_CMS_SEED_PROTECTED=1 para forzar)`);
          continue;
        }
        await uploadCmsFile(relative);
      }
    }
  } catch {
    // optional
  }
}

async function upsertRows(table, rows, onConflict) {
  if (!rows.length) {
    console.log(`${table}: 0 (skip)`);
    return;
  }
  const chunkSize = 500;
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize);
    const options = onConflict ? { onConflict } : undefined;
    const { error } = await supabase.from(table).upsert(chunk, options);
    if (error) {
      console.warn(`${table}: omitido (${error.message})`);
      return;
    }
  }
  console.log(`${table}: ${rows.length}`);
}

function bookingToRow(booking) {
  const total = booking.amountTotal ?? booking.totalPrice ?? 0;
  const paidCard =
    booking.amountPaidCard ??
    (booking.paymentMethod === "card" || booking.paymentMethod === "bizum"
      ? total
      : booking.paymentMethod === "deposit_10"
        ? Math.round(total * 10) / 100
        : 0);
  const dueCash =
    booking.amountDueCash ??
    (booking.paymentMethod === "pay_on_day"
      ? total
      : booking.paymentMethod === "deposit_10"
        ? total - paidCard
        : 0);

  return {
    id: booking.id,
    created_at: booking.createdAt,
    type: booking.type,
    tour_id: booking.tourId ?? null,
    tour_title: booking.tourTitle,
    service_date: booking.date,
    adults: booking.adults ?? 0,
    children: booking.children ?? 0,
    total_price: booking.totalPrice ?? total,
    amount_total: total,
    amount_paid_card: paidCard,
    amount_due_cash: dueCash,
    amount_paid_cash: booking.amountPaidCash ?? 0,
    payment_method: booking.paymentMethod,
    payment_status:
      booking.paymentStatus ??
      (booking.paymentMethod === "pay_on_day"
        ? "pay_on_day"
        : booking.paymentMethod === "deposit_10"
          ? "partial"
          : "paid"),
    cash_status:
      booking.cashStatus ??
      (booking.paymentMethod === "pay_on_day" ||
      booking.paymentMethod === "deposit_10"
        ? "pending"
        : "none"),
    status: booking.status ?? "confirmed",
    invoice_id: booking.invoiceId ?? null,
    cancellation_reason: booking.cancellationReason ?? null,
    cancelled_at: booking.cancelledAt ?? null,
    cancellation_fee: booking.cancellationFee ?? null,
    customer: booking.customer ?? {},
    transfer: booking.transfer ?? null,
    minibus: booking.minibus ?? null,
  };
}

function invoiceToRow(invoice) {
  return {
    id: invoice.id,
    number: invoice.number,
    type: invoice.type,
    booking_id: invoice.bookingId,
    created_at: invoice.createdAt,
    customer: invoice.customer ?? {},
    lines: invoice.lines ?? [],
    subtotal: invoice.subtotal ?? 0,
    tax_rate: invoice.taxRate ?? 0,
    tax_amount: invoice.taxAmount ?? 0,
    total: invoice.total ?? 0,
    related_invoice_id: invoice.relatedInvoiceId ?? null,
    notes: invoice.notes ?? null,
    status: invoice.status ?? "issued",
  };
}

function tourToRow(tour) {
  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    short_title: tour.shortTitle,
    category: tour.category,
    group_size: tour.groupSize ?? null,
    duration: tour.duration,
    duration_hours: tour.durationHours ?? 0,
    price_adult: tour.priceAdult ?? 0,
    price_child: tour.priceChild ?? 0,
    currency: tour.currency ?? "EUR",
    rating: tour.rating ?? 0,
    review_count: tour.reviewCount ?? 0,
    image: tour.image,
    gallery: tour.gallery ?? [],
    summary: tour.summary ?? "",
    description: tour.description ?? "",
    highlights: tour.highlights ?? [],
    places: tour.places ?? [],
    included: tour.included ?? [],
    not_included: tour.notIncluded ?? [],
    recommendations: tour.recommendations ?? [],
    cancellation_policy: tour.cancellationPolicy ?? "",
    max_group: tour.maxGroup ?? null,
    languages: tour.languages ?? [],
    allow_pay_on_day: tour.allowPayOnDay ?? false,
    allow_card: tour.allowCard ?? true,
    allow_bizum: tour.allowBizum ?? true,
    cruise_friendly: tour.cruiseFriendly ?? false,
    featured: tour.featured ?? false,
  };
}

async function tableCount(table) {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) {
    console.warn(`${table}: no se pudo contar (${error.message})`);
    return 0;
  }
  return count ?? 0;
}

async function seedTables() {
  const [transfers, settings, reviews, uiTranslations, english, german, adminExtras] =
    await Promise.all([
      readJson("transfers.json"),
      readJson("settings.json"),
      readJson("reviews.json"),
      readJson("uiTranslations.json"),
      readJson("i18n/en.json"),
      readJson("i18n/de.json"),
      readJson("adminExtras.json"),
    ]);

  await upsertRows(
    "transfer_destinations",
    transfers.destinations.map((destination, index) => ({
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      price_one_way: destination.priceOneWay,
      price_return: destination.priceReturn,
      price_extra_person: destination.priceExtraPerson ?? 10,
      duration: destination.duration,
      distance: destination.distance,
      sort_order: index,
      active: true,
    }))
  );
  await upsertRows("transfer_meta", [
    {
      id: 1,
      highlights: transfers.highlights ?? [],
      updated_at: new Date().toISOString(),
    },
  ]);
  await upsertRows("site_settings", [
    { id: 1, data: settings, updated_at: new Date().toISOString() },
  ]);

  const tripadvisor = reviews.tripadvisor ?? {};
  await upsertRows("tripadvisor_meta", [
    {
      id: 1,
      url: tripadvisor.url ?? "",
      rating: tripadvisor.rating ?? 0,
      review_count: tripadvisor.reviewCount ?? 0,
      location_id: tripadvisor.locationId ?? null,
      name: tripadvisor.name ?? null,
    },
  ]);
  await upsertRows(
    "reviews",
    (reviews.reviews ?? []).map((review) => ({
      id: review.id,
      author: review.author,
      title: review.title ?? null,
      body: review.text ?? "",
      rating: review.rating ?? 5,
      rating_scale: review.ratingScale ?? 5,
      locale: review.locale ?? null,
      review_date: review.date ?? null,
      source: review.source ?? null,
      featured: Boolean(review.featured),
      tour_id: review.tourId ?? null,
    }))
  );

  await upsertRows(
    "ui_translation_overrides",
    [
      { locale: "es", data: uiTranslations.es ?? {} },
      { locale: "en", data: uiTranslations.en ?? {} },
      { locale: "de", data: uiTranslations.de ?? {} },
    ],
    "locale"
  );
  await upsertRows(
    "content_translations",
    [
      { locale: "en", data: english },
      { locale: "de", data: german },
    ],
    "locale"
  );

  const extras = [
    ["payment_links", adminExtras.paymentLinks ?? []],
    ["collaborators", adminExtras.collaborators ?? []],
    ["customer_feedback", adminExtras.feedback ?? []],
    ["seo_redirects", adminExtras.redirects ?? []],
  ];
  for (const [table, items] of extras) {
    const existing = await tableCount(table);
    if (existing > 0) {
      console.log(`${table}: ${existing} filas, no se pisan`);
      continue;
    }
    await upsertRows(
      table,
      items.map((item) => ({ id: item.id, data: item }))
    );
  }

  console.log("bookings / invoices / contact_messages: no se siembran");
}

async function seed() {
  console.log("1) Creando buckets de Storage…");
  await ensureBucket(CMS_BUCKET, {
    public: false,
    fileSizeLimit: 50 * 1024 * 1024,
  });
  await ensureBucket("uploads", {
    public: true,
    fileSizeLimit: 6 * 1024 * 1024,
  });
  console.log("2) Sembrando tablas Postgres (fuente de verdad runtime)…");
  await seedTables();
  if (process.env.ALLOW_CMS_SEED_STORAGE === "1") {
    console.log("3) Subiendo JSON a Storage (backup opcional)…");
    await uploadAllCmsJson();
  }
  console.log("Seed de Supabase completado.");
}

seed().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
