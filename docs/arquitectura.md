# Arquitectura de la Aplicación: Red de Apoyo Colombia

## Stack Tecnológico

- **Framework**: Next.js 16.3.0 (App Router)
- **Lenguaje**: TypeScript estricto
- **Estilos**: Tailwind CSS v4 (CSS-first)
- **Componentes**: shadcn/ui v4 con tema Nova
- **Base de datos**: Prisma 6.19.3 + SQLite (local) / Neon PostgreSQL (producción)
- **Autenticación**: NextAuth v5 (beta.32) con JWT + Credentials
- **Formularios**: react-hook-form 7.85 + Zod 4
- **Mapas**: Leaflet + react-leaflet v5
- **Notificaciones**: sonner toasts
- **Compresión**: framer-motion

## Estructura de Rutas

- `(public)` - Rutas públicas (home, noticias, about)
- `(auth)` - Rutas de autenticación (login, registro, verificar-email)
- `(admin)` - Panel administrativo protegido (solo ADMIN/EDITOR)

## Componentes Principales

| Componente | Descripción |
|------------|-------------|
| `community-map.tsx` | Mapa interactivo con Leaflet |
| `google-news-feed.tsx` | Feed de noticias de Google News |
| `map-view.tsx` | Wrapper con `dynamic(..., { ssr: false })` |
| `map-section.tsx` | Sección de mapa con revalidación |

## Flujos de Trabajo Clave

### Autenticación
1. Registro con validación de contraseña (mín. 8 chars, mayúscula, minúscula, número)
2. Verificación de email (`REQUIRE_EMAIL_VERIFICATION=true`)
3. Login con soporte TOTP 2FA (`otplib` v13)
4. Recuperación de cuenta con códigos de error: `totp_required`, `invalid_totp`, `too_many_attempts`

### Reportes y Items
- Reportes de emergencia (`lostReports`) y donaciones (`items`)
- Validación Zod en `src/lib/validations.ts`
- Subida de imágenes en `src/app/api/upload/route.ts`
- Protección ABAC en `src/proxy.ts` (`canManageLostReport`, `canManageItem`)

### Seguridad
- Passwords hashed con bcryptjs
- Secretos 2FA cifrados AES-256-GCM en `src/lib/crypto.ts`
- Protección CSRF por defecto en `api/auth/[...nextauth]`
- Validación MIME y tamaño (5MB) en uploads

## Puntos de Entrada

- `src/app/layout.tsx` - Layout raíz con tema Nova
- `src/app/globals.css` - Variables CSS del tema (oklch)
- `src/proxy.ts` - Middleware de protección de rutas
- `src/lib/validations.ts` - Schemas Zod por modelo
- `src/lib/format.ts` - Helpers de formato (fechas, slugify)

## Despliegue

- **Proveedor**: Vercel
- **Comando**: `npm run build`
- **Variables críticas**: `VERCEL_BLOB_READ_WRITE_TOKEN`, `AUTH_SECRET`
- **Ruteo**: Middleware-based protection en `src/proxy.ts`

## Convenios de Código

- **TypeScript**: Estricto, sin `any` (solo `as unknown as` en resolvers Zod)
- **Componentes**: Server Components por defecto, `"use client"` cuando es necesario
- **Next/dynamic**: `ssr: false` solo en componentes clienta
- **Commits**: Mensajes en español, formato convencional