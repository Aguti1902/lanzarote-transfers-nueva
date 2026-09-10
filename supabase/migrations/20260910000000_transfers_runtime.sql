-- Lanzarote Transfers — columnas runtime + reseñas + RLS
-- Ejecutar después de 20260825170000_initial.sql (SQL Editor o supabase db push)

-- ── Bookings: campos que ya usa el mapper de la app ────────
alter table public.bookings add column if not exists service_time text;
alter table public.bookings add column if not exists time_slot text;
alter table public.bookings add column if not exists locale text;
alter table public.bookings add column if not exists pickup_zone text;
alter table public.bookings add column if not exists group_id text;
alter table public.bookings add column if not exists stripe_checkout_session_id text;
alter table public.bookings add column if not exists stripe_payment_intent_id text;
alter table public.bookings add column if not exists stripe_refund_id text;
alter table public.bookings add column if not exists stripe_refunded_at timestamptz;
alter table public.bookings add column if not exists stripe_refund_amount numeric(12,2);

-- ── Invoices: import legacy ────────────────────────────────
alter table public.invoices add column if not exists legacy_hash text;
alter table public.invoices add column if not exists payment_method text;

-- ── Transfers ──────────────────────────────────────────────
alter table public.transfer_destinations
  add column if not exists price_extra_person numeric(12,2) not null default 10;
alter table public.transfer_destinations
  add column if not exists sort_order int not null default 0;
alter table public.transfer_destinations
  add column if not exists active boolean not null default true;
alter table public.transfer_meta
  add column if not exists updated_at timestamptz not null default now();

-- ── Contact ────────────────────────────────────────────────
alter table public.contact_messages add column if not exists locale text;

-- ── UI translations: incluir ES ────────────────────────────
alter table public.ui_translation_overrides
  drop constraint if exists ui_translation_overrides_locale_check;
alter table public.ui_translation_overrides
  add constraint ui_translation_overrides_locale_check
  check (locale in ('es', 'en', 'de'));

-- ── Reviews ────────────────────────────────────────────────
create table if not exists public.reviews (
  id text primary key,
  author text not null,
  title text,
  body text not null,
  rating numeric(4,2) not null default 5,
  rating_scale numeric(4,2) not null default 5,
  locale text,
  review_date date,
  source text,
  featured boolean not null default false,
  tour_id text
);

create table if not exists public.tripadvisor_meta (
  id int primary key default 1 check (id = 1),
  url text not null default '',
  rating numeric(4,2) not null default 0,
  review_count int not null default 0,
  location_id text,
  name text
);

alter table public.reviews enable row level security;
alter table public.tripadvisor_meta enable row level security;

drop policy if exists "Public read reviews" on public.reviews;
create policy "Public read reviews" on public.reviews for select using (true);

drop policy if exists "Public read tripadvisor_meta" on public.tripadvisor_meta;
create policy "Public read tripadvisor_meta" on public.tripadvisor_meta for select using (true);

grant select on table public.reviews to anon, authenticated;
grant select on table public.tripadvisor_meta to anon, authenticated;
grant all on table public.reviews to service_role;
grant all on table public.tripadvisor_meta to service_role;
