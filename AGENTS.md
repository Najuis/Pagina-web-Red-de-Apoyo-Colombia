<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Proyecto: Red de Apoyo Colombia (plataforma de ayuda ante desastres)

Plataforma de ayuda humanitaria (foco: terremoto del 10/08/2026 en Eje Cafetero y Cauca). Dominio de producción: **apoyocolombia.online**. Sin branding religioso/parroquial. Marca/sitio configurable en `src/lib/site.config.ts` (única fuente: nombre, redes, contacto, mapa — centrado en Colombia: `{ lat: 4.5, lng: -76.0 }, zoom: 8`).

Dominios de datos (en `src/types/index.ts`):
- **Categorías de publicación**: `EMERGENCIA, ALERTAS, AYUDA, DONACIONES, VOLUNTARIADO, COMUNIDAD, OTROS`.
- **Tipos de aviso/evento**: `VOLUNTARIADO, DONACION, RESCATE, CAPACITACION, ALBERGUE, EVENTO, ACTIVIDAD`.
- **Categorías de insumos**: `ALIMENTOS, AGUA, ROPA, MEDICAMENTOS, ALOJAMIENTO, TRANSPORTE, SERVICIOS, VOLUNTARIADO, OTROS`.
- **Tipos de ubicación (mapa)**: `CENTRO_ACOPIO, ALBERGUE, CENTRO_SALUD, PUNTO_ENCUENTRO, PUNTO_INFORMACION, OTRO`.

## Stack (verificado)

- **Next.js 16.3.0** (Turbopack) + React 19 + TypeScript estricto
- **Tailwind CSS v4** (CSS-first, sin `tailwind.config.ts`)
- **shadcn/ui v4** con preset `radix` + tema `nova`; componentes usan el paquete unificado `radix-ui` (ej. `import { Slot } from "radix-ui"`, usar `Slot.Root`). El registro NO tiene componente `form` (se escribió a mano en `src/components/ui/form.tsx`).
- **Prisma 6.19.3** + **SQLite local** (`file:./dev.db`). Enums evitados (SQLite no los soporta): campos `String` + uniones TS en `src/types/index.ts` con labels por modelo. Migrar a PostgreSQL = cambiar `provider` en `prisma/schema.prisma` a `postgresql` + actualizar `DATABASE_URL`.
- **NextAuth v5** (beta.32) con `Credentials` + sesiones JWT. Tipos augmentados en `src/types/next-auth.d.ts` (añaden `id` y `role` al usuario de sesión).
- **react-hook-form 7.85** + **@hookform/resolvers 5.7.1** + **zod 4**
- **Leaflet + react-leaflet v5** con tiles de OpenStreetMap (sin API key)
- **framer-motion**, **bcryptjs**, **sonner** (toasts)

## Peculiaridades de Next.js 16 (importantes)

- **`middleware.ts` → `src/proxy.ts`** (Next 16 lo renombra y cambia export a `proxy`). Usa `getToken` de `next-auth/jwt`; **debe pasar `secret: process.env.AUTH_SECRET`** explícito o lanza `MissingSecret`.
- **`params` y `searchParams` son `Promise`** en páginas/layouts: `const { id } = await params`.
- `LayoutProps` tipado por rutas generadas: NO usar `LayoutProps<"/ruta">` en layouts de sub-ruta (el constraint solo acepta `"/"`); tipar `{ children: ReactNode }` directamente.
- `next/dynamic` con `ssr: false` **solo se permite en Client Components** (`"use client"` obligatorio en el wrapper).
- `revalidatePath`/`revalidate` de segment-schema funcionan salvo que `cacheComponents` esté activado (opt-in en `next.config.ts`).

## Resolver + RHF (trampa de tipos)

`zodResolver` devuelve `Resolver<z.input, any, z.output>`; RHF 7.85 exige que el tipo del form case con el resolver. Patrón que funciona:
- Formularios sin campos `coerce` (ej. `content-form.tsx`): `useForm<FormValues>` con `resolver: zodResolver(schema) as Resolver<FormValues>`.
- Formularios con `z.coerce.date()`/`z.coerce.number()` (event/lost/item/location): el input (string) no overlap con el output (Date/number), usar `resolver: zodResolver(schema) as unknown as Resolver<FormValues>`.
- Definir siempre un tipo `FormValues` explícito (con fechas/coords como `string`) en lugar de intersectar `Input & { ... }`.

## Comandos

- `npm run dev` — dev server
- `npm run build` / `npm run lint` / `npm run typecheck` (`tsc --noEmit`)
- `npm run prisma:generate` / `npm run prisma:migrate` (crea `prisma/dev.db`) / `npm run prisma:seed`
- Seed: `admin@comunidad.local / Admin123!` (ADMIN), `editor@comunidad.local / Editor123!` (EDITOR). Datos de ejemplo sobre la emergencia (albergues, centros de acopio, voluntariado) con coordenadas reales de Colombia.

## Estructura

- **Rutas**: grupos `(public)`, `(auth)` (login/registro), `(admin)` (panel con sidebar sticky). Admin protegido en `src/proxy.ts` para roles ADMIN/EDITOR.
- **Server Actions**: en `src/app/actions/*.ts`, todos `"use server"`. `requireRole(roles)` en `post-actions.ts` (devuelve `Session["user"] | null`). Helpers `ActionResult`.
- **Validación**: `src/lib/validations.ts` (schemas zod por modelo). **Formato**: `src/lib/format.ts` (fechas, `slugify`, `toDateTimeLocal`).
- **Subida de imágenes**: `src/lib/upload.ts` — dev local a `public/uploads`, prod con Vercel Blob (`VERCEL_BLOB_READ_WRITE_TOKEN`). Route `src/app/api/upload/route.ts`.
- **Mapas**: `src/components/map/community-map.tsx` (client, Leaflet) + wrappers `map-view.tsx` y `map-section.tsx` con `dynamic(..., { ssr: false })`.

## Google News (integración e indexación)

- **Feed en la página**: `src/components/news/google-news-feed.tsx` (Server Component) + `src/lib/google-news.ts`. Consume el RSS público de Google News (`news.google.com/rss/search?q=...&hl&gl&ceid`) con `rss-parser`; fetch cached (`cache: "force-cache"`, `next: { revalidate: 3600 }`). Queries/límite en `siteConfig.googleNews`. Aparece en home y `/noticias`.
- **JSON-LD**: las noticias generan `NewsArticle` en `src/app/(public)/noticias/[slug]/page.tsx` (headline, fechas, autor, publisher, mainEntityOfPage).
- **Sitemap de noticias**: `src/app/news-sitemap.xml/route.ts` (XML `news:news`), `dynamic = "force-dynamic"`, referenciado vía `host` en `robots.ts`.
- **Despliegue (Hostinger)**: pasar `provider` en `prisma/schema.prisma` a `postgresql` y conectar a Supabase/Neon (Hostinger Node no incluye Postgres nativo). Configurar en hPanel: app type `next`, build `build`, output `.next`; variables `DATABASE_URL` (Postgres), `AUTH_SECRET` (nueva), `NEXT_PUBLIC_SITE_URL=https://apoyocolombia.online`.

## Estilo

- TypeScript estricto; **no usar `any`** (los casts `as unknown as` en resolvers son el único caso aceptado, documentado arriba).
- Sin comentarios de código salvo que se pidan. Textos en español. Tailwind v4 con tokens CSS de marca en `src/app/globals.css` (primary deep blue `#1E3A8A`, secondary amber `#F59E0B`, accent verde `#10B981`; fuentes Playfair Display `--font-heading` + Inter `--font-sans`).
