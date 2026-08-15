# Red de Apoyo Colombia

## Dominios de datos (`src/types/index.ts`)

- **Categorías publicación**: `EMERGENCIA, ALERTAS, AYUDA, DONACIONES, VOLUNTARIADO, COMUNIDAD, OTROS`
- **Tipos aviso/evento**: `VOLUNTARIADO, DONACION, RESCATE, CAPACITACION, ALBERGUE, EVENTO, ACTIVIDAD`
- **Categorías insumos**: `ALIMENTOS, AGUA, ROPA, MEDICAMENTOS, ALOJAMIENTO, TRANSPORTE, SERVICIOS, VOLUNTARIADO, OTROS`
- **Tipos ubicación mapa**: `CENTRO_ACOPIO, ALBERGUE, CENTRO_SALUD, PUNTO_ENCUENTRO, PUNTO_INFORMACION, OTRO`

## Stack

- **Next.js 16.3.0** + React 19 + TypeScript estricto
- **Tailwind CSS v4** (CSS-first, sin `tailwind.config.ts`)
- **shadcn/ui v4** con preset `radix` + tema `nova`; paquete unificado `radix-ui` (ej. `import { Slot } from "radix-ui"`)
- **Prisma 6.19.3** + SQLite local (`file:./dev.db`). Campos `String` + uniones TS; evitar enums de base de datos
- **NextAuth v5** (beta.32) con `Credentials` + sesiones JWT. Tipos augmentados en `src/types/next-auth.d.ts`
- **react-hook-form 7.85** + **@hookform/resolvers 5.7.1** + **zod 4**
- **Leaflet + react-leaflet v5** con tiles OpenStreetMap (sin API key)
- **framer-motion**, **bcryptjs**, **sonner** (toasts)

## Peculiaridades Next.js 16

- **`params` y `searchParams` son `Promise`** en páginas/layouts: `const { id } = await params`
- **`LayoutProps` por rutas generadas**: NO usar `LayoutProps<"/ruta">` en layouts de sub-ruta (solo acepta `"/"`); tipar `{ children: ReactNode }` directamente
- **`next/dynamic` con `ssr: false`**: solo en Client Components (`"use client"` obligatorio en wrapper)
- `revalidatePath`/`revalidate` funcionan salvo que `cacheComponents` esté activado (opt-in en `next.config.ts`)
- **`middleware.ts` → `src/proxy.ts`**: Next 16 lo renombra y cambia export a `proxy`. Usa `getToken` de `next-auth/jwt`; **debe pasar `secret: process.env.AUTH_SECRET`** explícito o lanza `MissingSecret`

## Resolver + RHF (trampa de tipos)

- `zodResolver` devuelve `Resolver<z.input, any, z.output>`; RHF 7.85 exige que el tipo del form case con el resolver
- **Sin campos `coerce`** (ej. `content-form.tsx`, `item-form.tsx`): el cast directo basta — `resolver: zodResolver(schema) as Resolver<FormValues>`
- **Con `z.coerce.date()`/`z.coerce.number()`**: input (string) y output (Date/number) no overlap, TS rechaza el cast directo; usar `as unknown as Resolver<FormValues>`. Si un cast directo da error, probar primero `as unknown as`
- Definir siempre un tipo `FormValues` explícito (con fechas/coords como `string`) en lugar de intersectar `Input & { ... }`

## Comandos

- `npm run dev` — dev server
- `npm run build` / `npm run lint` / `npm run typecheck` (`tsc --noEmit`)
- `npm run prisma:generate` / `npm run prisma:migrate` (crea `prisma/dev.db`) / `npm run prisma:seed`
- **Seed**: `admin@comunidad.local / Admin123!` (ADMIN), `editor@comunidad.local / Editor123!` (EDITOR). Datos de ejemplo con coordenadas de Colombia.

## Estructura

- **Rutas**: grupos `(public)`, `(auth)` (login/registro), `(admin)` (panel con sidebar sticky). Admin protegido en `src/proxy.ts` para roles ADMIN/EDITOR.
- **Server Actions**: en `src/app/actions/*.ts`, todos `"use server"`. `requireRole(roles)` en `post-actions.ts` (devuelve `Session["user"] | null`). Helpers `ActionResult`.
- **Validación**: `src/lib/validations.ts` (schemas zod por modelo). **Formato**: `src/lib/format.ts` (fechas, `slugify`, `toDateTimeLocal`)
- **Subida de imágenes**: `src/lib/upload.ts` — dev local a `public/uploads`, prod con Vercel Blob (`VERCEL_BLOB_READ_WRITE_TOKEN`). Route `src/app/api/upload/route.ts`
- **Mapas**: `src/components/map/community-map.tsx` (client, Leaflet) + wrappers `map-view.tsx` y `map-section.tsx` con `dynamic(..., { ssr: false })`

## Seguridad (implementada)

- **2FA TOTP**: `otplib` v13 con API funcional (`generateSecret`, `generateURI`, `verifySync`). El secreto se guarda cifrado AES-256-GCM (clave derivada de `AUTH_SECRET`) en `User.twoFactorSecret` via `src/lib/crypto.ts`. **Ojo**: rate-limit y cifrado 2FA son single-instance/memoria; si `AUTH_SECRET` cambia, los secretos 2FA quedan indescifrables (reconfigurar)
- **Códigos de error login** (client): `totp_required`, `invalid_totp`, `too_many_attempts`, `email_not_verified`
- **Verificación email**: campos `emailVerified`/`emailVerificationToken`/`emailVerificationExpires` en `User`; token creado en registro; ruta `/verificar-email`. Bloqueo login con env `REQUIRE_EMAIL_VERIFICATION=true` (sin SMTP, el enlace se muestra en UI registro)
- **ABAC**: `canManageLostReport`/`canManageItem` (`lost-actions.ts`, `item-actions.ts`) permiten editar/borrar al dueño del recurso además de ADMIN/EDITOR
- **Password**: registro exige min 8 + mayúscula + minúscula + número (`passwordSchema` en `validations.ts`). `login` solo exige no vacío
- `src/proxy.ts` protege `/admin` (ADMIN/EDITOR) y `/perfil` (cualquier sesión)
- **OWASP**: Inyección SQL mitigado con Prisma ORM. XSS: sanitización básica en Zod, `escapeXml` en sitemap. CSRF: protección por defecto en `api/auth/[...nextauth]`. Upload valida tipos MIME y tamaño (5MB). Sin `helmet` configurado.

## Google News (integración e indexación)

- **Feed en la página**: `src/components/news/google-news-feed.tsx` (Server Component) + `src/lib/google-news.ts`. Consume RSS público de Google News con `rss-parser`; fetch cached (`cache: "force-cache"`, `next: { revalidate: 3600 }`). Queries/límite en `siteConfig.googleNews`. Aparece en home y `/noticias`
- **JSON-LD**: las noticias generan `NewsArticle` en `src/app/(public)/noticias/[slug]/page.tsx`
- **Sitemap de noticias**: `src/app/news-sitemap.xml/route.ts` (XML `news:news`), `dynamic = "force-dynamic"`, referenciado vía `host` en `robots.ts`

## Protección de Datos

- **Encriptación en tránsito**: Sitio servido sobre HTTPS ( `siteConfig.url` usa `https://apoyocolombia.online` en prod). NextAuth usa JWT sobre conexión TLS. El TLS/SSL suele gestionarse por la plataforma de despliegue (Vercel). **Ojo**: no hay configuración HSTS ni CSP definida en el código.
- **Encriptación en reposo**: Passwords hashed con bcryptjs (`validations.ts:80-85`). Secretos 2FA cifrados AES-256-GCM via `src/lib/crypto.ts` en `User.twoFactorSecret`. **Falta**: otros datos en reposo (posts, lostReports, items, comentarios) se guardan en texto plano en SQLite/PostgreSQL.
- **Protección de PII**: Rutas `/admin` y `/perfil` protegidas por `src/proxy.ts`. Email y nombre en sesión de NextAuth. **Falta**: máscarado de datos sensibles en logs/consola, ni políticas de consentimiento/right-to-be-forgotten para cumplimiento GDPR/Habeas Data.
- **Cumplimiento GDPR/Habeas Data (Colombia)**: No hay implementación explícita: ausente `right-to-be-forgotten`, flujos de exportación de datos, consentimiento previo en formularios, o política de retención de datos. El campo `emailVerified`/`emailVerificationToken` existe pero sin flujo de solicitud de supresión de datos.
- **Máscara de datos sensibles en logs**: No hay log estructurado ni máscarado en el códigobase. `loginAttempts` en `src/lib/auth.ts` guarda claves `ip:email` en memoria. **Falta**: biblioteca de máscarado (p. ej. `p-ify` o `maska`) para logs de consola y errores.

## Estilo

- TypeScript estricto; **no usar `any`** (los casts `as unknown as` en resolvers son el único caso aceptado, documentado arriba)
- Sin comentarios de código salvo que se pidan. Textos en español. Tailwind v4 con variables CSS inline en `src/app/globals.css` (tokens oklch del tema shadcn nova en `:root`/`.dark`; el único hex de marca `#1E3A8A` es `themeColor` en `src/app/layout.tsx`). Fuentes: Inter `--font-sans`, Playfair Display `--font-heading`, Geist Mono `--font-geist-mono`