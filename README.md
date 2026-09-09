# Lanzarote Transfers

Web de traslados privados en Lanzarote (Next.js + React), con panel de administración para reservas, destinos, pagos y estadísticas.

## Arranque

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Supabase (datos en producción)

Por defecto la app puede usar JSON locales. Con Supabase configurado, **reservas, CMS, facturas y uploads** pasan a la base de datos.

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En el SQL Editor, ejecuta el script:
   `supabase/migrations/20260825170000_initial.sql`
3. En Storage, crea un bucket público llamado `uploads` (y `cms` si lo usáis para el CMS).
4. Copia `.env.example` → `.env.local` y rellena:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=tu-password-admin
```

5. Importa los datos demo actuales:

```bash
npm run seed:supabase
# o: node --env-file=.env.local scripts/seed-supabase.mjs
```

6. En Vercel, añade las mismas variables de entorno y redespliega.

Si faltan las variables de Supabase, la app sigue funcionando con `src/data/*.json` (modo local).

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

Los cambios se guardan en `src/data/*.json` y se ven en la web al instante.

## Chat IA

Botón flotante **Chat IA** en la web pública. Responde sobre destinos, precios y reservas de traslados.

## Páginas públicas

- `/` — Inicio
- `/sobre-nosotros`
- `/traslados` — aeropuerto ↔ destinos
- `/contacto`
- `/gestionar-reserva` / `/cancelar-reserva`
