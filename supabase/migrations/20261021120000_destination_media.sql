-- Foto y texto propio por destino (casillas públicas)
alter table public.transfer_destinations
  add column if not exists image text not null default '';
alter table public.transfer_destinations
  add column if not exists description text not null default '';
