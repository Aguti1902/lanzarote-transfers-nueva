# Lanzarote Transfers

Web de traslados privados en Lanzarote (Next.js + React), con panel de administración para reservas, destinos, pagos y estadísticas.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Sin claves de Supabase, la app usa `src/data/*.json` (modo local).

## Proyecto Supabase nuevo

La fuente de verdad en producción es **Postgres**. Storage `uploads` sirve solo para fotos del panel. El bucket `cms` es un backup JSON opcional, no el catálogo vivo.

No se puede crear el proyecto desde aquí. En [supabase.com](https://supabase.com):

1. **New project** (región cercana, p. ej. `eu-west-1`).
2. En el **SQL Editor**, ejecuta en este orden:
   - `supabase/migrations/20260825170000_initial.sql`
   - `supabase/migrations/20260910000000_transfers_runtime.sql`
   - (opcional) `supabase/migrations/20260908150000_storage_policies.sql`
3. **Project Settings → API**: copia URL, anon key y service role key.
4. Copia `.env.example` → `.env.local` y rellena:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=tu-password-admin
```

5. Si usas la CLI de Supabase, también vale `supabase db push` con esas migraciones.
6. Siembra destinos, ajustes, reseñas y traducciones (no pisa reservas/facturas/mensajes):

```bash
ALLOW_CMS_SEED=1 npm run seed:supabase
```

El seed crea los buckets `uploads` (público) y `cms` (privado). No hace falta crearlos a mano.

Backup JSON opcional a Storage:

```bash
ALLOW_CMS_SEED=1 ALLOW_CMS_SEED_STORAGE=1 npm run seed:supabase
```

7. En **Vercel**, añade las mismas variables y redespliega.

### Qué vive en Postgres

- Reservas, facturas, destinos y highlights
- Ajustes del sitio (`site_settings`)
- Mensajes de contacto
- Enlaces de pago, colaboradores, feedback y redirecciones SEO
- Reseñas + meta TripAdvisor
- Traducciones UI y de contenido

Si faltan las claves o Postgres falla, se vuelve al JSON local / Storage.

El admin sigue con `ADMIN_PASSWORD` + cookie (sin Auth de Supabase).

## Panel admin

- URL: `/admin`
- Contraseña: la de `ADMIN_PASSWORD` en el servidor (cookie httpOnly; no uses `admin123` en producción)
- En Vercel configura también `ADMIN_SESSION_SECRET` y `CRON_SECRET`

Desde el panel puedes:

| Sección | Qué puedes hacer |
|---------|------------------|
| Dashboard | Estadísticas, accesos rápidos |
| Banner | Texto marquee ES/EN/DE |
| Reservas | Ver todas, confirmar / completar / cancelar |
| Pagos online | Crear enlaces de pago y marcar estados |
| Cobros efectivo | Seguir depósitos y cobros del día |
| Facturas | Emitir / abonar |
| Estadísticas | Ingresos y métodos de pago |
| Traslados | Destinos, precios ida/vuelta |
| Colaboradores | Agencias / hoteles B2B |
| Feedback | Valoraciones y sugerencias de clientes |
| Redirecciones | 301/302 SEO entre slugs |
| Traducciones | Textos UI ES → EN / DE |
| Ajustes | Contacto, textos hero, datos fiscales |

Con Supabase, los cambios se guardan en Postgres. Sin claves, en `src/data/*.json`.

## Chat IA

Botón flotante **Chat IA** en la web pública. Responde sobre destinos, precios y reservas de traslados.

## Páginas públicas

- `/` — Inicio
- `/sobre-nosotros`
- `/traslados` — aeropuerto ↔ destinos
- `/contacto`
- `/gestionar-reserva` / `/cancelar-reserva`
