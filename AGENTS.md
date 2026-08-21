# Red de Apoyo Colombia

## Dominios de datos (`src/types/index.ts`)

- **Categorías publicación**: `EMERGENCIA, ALERTAS, AYUDA, DONACIONES, VOLUNTARIADO, COMUNIDAD, OTROS`
- **Kinds/status post**: `POST_KINDS = PUBLICACION | NOTICIA`; `POST_STATUSES = PUBLICADO | BORRADOR`
- **Tipos aviso/evento**: `VOLUNTARIADO, DONACION, RESCATE, CAPACITACION, ALBERGUE, EVENTO, ACTIVIDAD`
- **Categorías insumos**: `ALIMENTOS, AGUA, ROPA, MEDICAMENTOS, ALOJAMIENTO, TRANSPORTE, SERVICIOS, VOLUNTARIADO, OTROS`
- **Perdidos**: `LOST_TYPES = PERSONA | ANIMAL`; `LOST_STATUSES = PERDIDO | ENCONTRADO | BUSQUEDA_ACTIVA`
- **Contacto**: `CONTACT_TYPES = WHATSAPP | TELEFONO | EMAIL`
- **Tipos ubicación mapa**: `CENTRO_ACOPIO, ALBERGUE, CENTRO_SALUD, PUNTO_ENCUENTRO, PUNTO_INFORMACION, OTRO`
- Los campos DB son `String` + uniones TS (`src/types/index.ts`); no hay enums de BD.

## Stack

- **Next.js 16.3.0** + React 19 + TypeScript estricto
- **Tailwind CSS v4** (CSS-first, sin `tailwind.config.ts`)
- **shadcn/ui v4** con preset `radix` + tema `nova`; paquete unificado `radix-ui` (ej. `import { Slot } from "radix-ui"`)
- **Prisma 6.19.3 + PostgreSQL** (Neon) via `DATABASE_URL`. `prisma/schema.prisma` usa `provider = "postgresql"`; `.env` apunta a Neon. `prisma/dev.db` es un artefacto SQLite obsoleto — ignorar
- **NextAuth v5** (beta.32) con `Credentials` + sesiones JWT. Tipos augmentados en `src/types/next-auth.d.ts`
- **react-hook-form 7.85** + **@hookform/resolvers 5.7.1** + **zod 4**
- **Leaflet + react-leaflet v5** con tiles OpenStreetMap (sin API key)
- **framer-motion**, **bcryptjs** (rondas 12 en registro), **sonner** (toasts), **pino** (logger), **nodemailer** (Gmail SMTP, ver Seguridad)

## Peculiaridades Next.js 16

- **`params` y `searchParams` son `Promise`** en páginas/layouts: `const { id } = await params`
- **`LayoutProps` por rutas generadas**: NO usar `LayoutProps<"/ruta">` en layouts de sub-ruta (solo acepta `"/"`); tipar `{ children: ReactNode }` directamente
- **`next/dynamic` con `ssr: false`**: solo en Client Components (`"use client"` obligatorio en wrapper, ej. `map-view.tsx`)
- **`middleware.ts` → `src/proxy.ts`**: Next 16 lo renombra y cambia export a `proxy`. `matcher` solo cubre `/admin/:path*`, `/perfil`, `/login`, `/registro` — al añadir rutas protegidas hay que ampliarlo. Usa `getToken` de `next-auth/jwt`; **debe pasar `secret: process.env.AUTH_SECRET`** explícito o lanza `MissingSecret`

## Resolver + RHF (trampa de tipos)

- `zodResolver` devuelve `Resolver<z.input, any, z.output>`; RHF 7.85 exige que el tipo del form case con el resolver
- **Sin campos `coerce`** (`content-form.tsx`, `item-form.tsx`): el cast directo basta — `resolver: zodResolver(schema) as Resolver<FormValues>`
- **Con `z.coerce.date()`/`z.coerce.number()`** (`event-form.tsx`, `lost-form.tsx`, `location-form.tsx`): input (string) y output (Date/number) no overlap, TS rechaza el cast directo; usar `as unknown as Resolver<FormValues>`. Si un cast directo da error, probar primero `as unknown as`
- Definir siempre un tipo `FormValues` explícito (con fechas/coords como `string`) en lugar de intersectar `Input & { ... }`
- **Ojo: campos `disabled` se borran del submit**. `handleSubmit` elimina de los datos enviados todo campo con `disabled` (lo hace RHF internamente). Fue la causa del bug de login 2FA: al pasar al paso TOTP se deshabilitaban email/password y el submit solo enviaba el código → siempre "Credenciales inválidas". No deshabilitar inputs que luego deban reenviarse

## Comandos

- `npm run dev` — dev server
- `npm run build` / `npm run lint` (= `eslint`, flat config) / `npm run typecheck` (`tsc --noEmit`)
- **No hay test suite**: `npm test` no existe; el job `test` del CI (`ci.yml`) es un no-op. El flujo CI real es `lint → build`
- `npm run prisma:generate` / `npm run prisma:migrate` (`prisma migrate dev`) / `npm run prisma:seed` (`tsx prisma/seed.ts`)
- **`build` = `prisma generate && prisma migrate deploy && next build`**; `migrate deploy` y `prisma:migrate` requieren `DATABASE_URL` (Neon). Migración inicial `0_init` ya creada y marcada como aplicada
- **Ojo (Windows)**: si `next dev` está corriendo, `prisma generate`/`build` falla con `EPERM` (DLL `query_engine-windows.dll.node` bloqueada). Detener el dev server antes de generar/buildear y reiniciarlo después
- **Seed**: `admin@comunidad.local / Admin123!` (ADMIN), `editor@comunidad.local / Editor123!` (EDITOR). Datos de ejemplo con coordenadas de Colombia. Reset total de tablas antes de insertar

## Estructura

- **Rutas**: grupos `(public)`, `(auth)` (login/registro/verificar-email), `(admin)` (panel con sidebar). `src/proxy.ts` protege `/admin` (ADMIN/EDITOR) y `/perfil` (sesión); login/registro redirigen a `/admin` si ya hay sesión
- **Server Actions**: en `src/app/actions/*.ts`, todos `"use server"`. `requireRole(roles)` en `post-actions.ts` (devuelve `Session["user"] | null`), exporta tipo `ActionResult`
- **Validación**: `src/lib/validations.ts` (schemas zod por modelo). **Formato**: `src/lib/format.ts` (fechas, `slugify`, `toDateTimeLocal`); ojo: `money()` usa locale `es-MX`/moneda `MXN`
- **Subida de imágenes**: `src/lib/upload.ts` — dev local a `public/uploads`, prod con Vercel Blob (`VERCEL_BLOB_READ_WRITE_TOKEN`). Route `src/app/api/upload/route.ts`
- **Mapas**: `src/components/map/community-map.tsx` (client, Leaflet) + wrappers `map-view.tsx` y `map-section.tsx` con `dynamic(..., { ssr: false })`
- **Cuidado**: `src/app/admin/usuarios/page.tsx` está FUERA del grupo `(admin)` → URL `/admin/usuarios` sin layout de sidebar y su botón "Editar" apunta a una ruta inexistente. Si se toca el panel, considerar moverla a `(admin)/admin/usuarios`
- `docs/arquitectura.md` existe pero está parcialmente desactualizado (dice "SQLite local")

## Seguridad (implementada)

- **2FA TOTP**: wrapper `src/lib/two-factor.ts` expone `generateSecret`, `buildOtpauthUrl`, `verifyTotp` (envuelve `generateURI`/`verifySync` de `otplib`). Secreto cifrado AES-256-GCM (`src/lib/crypto.ts`) con clave = sha256(`AUTH_SECRET`); si falta `AUTH_SECRET` usa `dev-insecure-secret-change-me`. **Ojo**: si `AUTH_SECRET` cambia, los secretos 2FA quedan indescifrables (reconfigurar)
- **Códigos de error login** (client): `totp_required`, `invalid_totp`, `too_many_attempts`, `email_not_verified`, `account_disabled`. Rate-limit: `Map` en memoria en `src/lib/auth.ts`, 6 intentos/15 min por `ip:email`
- **QR público en login**: `getLoginQrAction` (`auth-actions.ts`) expone el QR 2FA de la cuenta `LOGIN_QR_EMAIL` (default `admin@comunidad.local`) en la página pública `/login` — cualquiera que lo escanee genera códigos válidos; es una práctica pensada para compartir cuentas de equipo, no para producción pública
- **Verificación email**: token creado en registro, ruta `/verificar-email`. `REQUIRE_EMAIL_VERIFICATION=true` bloquea login. **No se envía correo en registro**: el enlace se devuelve en la UI. `src/lib/mailer.ts` (nodemailer/Gmail `GMAIL_USER`+`GMAIL_APP_PASSWORD`) define `sendVerificationEmail`/`sendPasswordResetEmail` pero **ninguna se invoca todavía** (no hay ruta de reset)
- **ABAC**: `canManageLostReport`/`canManageItem` (`lost-actions.ts`, `item-actions.ts`) permiten editar/borrar al dueño del recurso además de ADMIN/EDITOR
- **Password**: registro exige min 8 + mayúscula + minúscula + número (`passwordSchema` en `validations.ts`), bcrypt ronda 12. `login` solo exige no vacío
- **Headers de seguridad**: definidos en `next.config.ts` `async headers()` global (CSP, HSTS, X-Frame-Options, nosniff, etc.). **Ojo**: la directiva CSP `connect-self;` está malformada (falta `-src`); corregir al tocar `next.config.ts`. `helmet` está en package.json pero no se importa en ningún sitio
- **CORS**: manual en `src/proxy.ts` con whitelist `ALLOWED_ORIGINS` (default localhost + apoyocolombia.online)
- **OWASP**: Inyección SQL mitigado con Prisma ORM. XSS: sanitización básica en Zod, `escapeXml` en news-sitemap. CSRF: protección por defecto en `api/auth/[...nextauth]`. Upload valida MIME (jpeg/png/webp/gif) y 5MB
- **Logging**: `src/lib/logger.ts` (pino) con `redact()` que enmascara `password`, `email`, `apiKey`, `authToken`, `twoFactorSecret`, etc. Usado en `auth.ts` y en el route de GDPR

## GDPR / Habeas Data

- Endpoints en `src/app/api/rights/route.ts`: `GET ?action=status|export|delete` y `POST {type, email}`. Export devuelve profile+posts+lostReports+items; delete borra datos relacionados **pero conserva la fila `User`**
- **Caveat**: los GET `export`/`delete` exponen datos por email sin autenticación (usar con cuidado)

## Google News (integración e indexación)

- **Feed**: `src/components/news/google-news-feed.tsx` (Server Component) + `src/lib/google-news.ts`. RSS público con `rss-parser`; fetch cached (`cache: "force-cache"`, `next: { revalidate: 3600 }`). Queries/límite en `siteConfig.googleNews`. Aparece en home y `/noticias`
- **JSON-LD**: las noticias generan `NewsArticle` en `src/app/(public)/noticias/[slug]/page.tsx`
- **Sitemap**: `src/app/news-sitemap.xml/route.ts` (XML `news:news`), `dynamic = "force-dynamic"`, referenciado vía `host` en `robots.ts`

## Estilo

- TypeScript estricto; **no usar `any`** (los casts `as unknown as` en resolvers son el único caso aceptado, documentado arriba; `logger.ts` lo usa internamente)
- Sin comentarios de código salvo que se pidan. Textos en español. Tailwind v4 con variables CSS inline en `src/app/globals.css` (tokens oklch del tema shadcn nova en `:root`/`.dark`; el único hex de marca `#1E3A8A` es `themeColor` en `src/app/layout.tsx`). Fuentes: Inter `--font-sans`, Playfair Display `--font-heading`, Geist Mono `--font-geist-mono`
</content>