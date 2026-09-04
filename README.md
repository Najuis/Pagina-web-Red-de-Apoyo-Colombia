This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 📋 Descripción general

Plataforma web para Red de Apoyo Colombia que facilita la ayuda comunitaria ante desastres naturales. El sitio permite gestionar alertas, voluntariado, donaciones, rescates y recursos de apoyo en tiempo real.

## ✅ Características de Seguridad Implementadas (Prioridad Alta, Media, Baja)

### Seguridad de Nivel Alto ✅

- **Headers de Seguridad via `src/proxy.ts`**:
  - `X-Content-Type-Options: nosniff` - previene MIME sniffing
  - `X-Frame-Options: SAMEORIGIN` - previene clickjacking
  - `X-XSS-Protection: 1; mode=block` - protección contra XSS en navegadores
  - `Referrer-Policy: strict-origin-when-cross-origin` - control de referrer
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()` - restricción de APIs

- **CORS configurado** - Origin whitelist desde variable `ALLOWED_ORIGINS` en `.env`
- **Autenticación con NextAuth v5** - JWT en sesiones, protección de rutas `/admin` y `/perfil`
- **2FA TOTP** - `otplib` v13 con secreto cifrado AES-256-GCM en `User.twoFactorSecret`
- **Password hashing** - `bcryptjs` con ronda de 12, mínimo 8 caracteres con mayúscula/minúscula/número
- **Rate limiting** - Máximo 6 intentos en ventana de 15 minutos por IP+email
- **TypeScript estricto** - Sin uso de `any` (solo casts documentados `as unknown as`)

### Seguridad de Nivel Medio ✅

- **GDPR data subject requests** - Endpoints en `src/app/api/rights/route.ts`:
  - `GET /api/rights?action=status` - Verificar datos personales
  - `GET /api/rights?action=export&email=xyz` - Exportar datos del usuario
  - `GET /api/rights?action=delete&email=xyz` - Eliminar datos del usuario
  - `POST /api/rights` - Solicitar operaciones GDPR con validación de email

- **Pino logger con data masking** - `src/lib/logger.ts` - Enmascara passwords, emails, API keys, secretos 2FA en logs
- **Prisma conectado a Neon PostgreSQL** - `DATABASE_URL` en `.env` y `.env.production`
- **Migraciones de base de datos** - Schema actualizado con campos `isActive`, `passwordResetToken`, `passwordResetExpires`

### Seguridad de Nivel Bajo ✅

- **Validación Zod** en todos los formularios (`src/lib/validations.ts`)
- **Sanitización XSS básica** - En schemas Zod y `escapeXml` en sitemap
- **CSRF protection** - Protección por defecto en `api/auth/[...nextauth]`
- **Validación de upload** - Tipos MIME y tamaño máximo 5MB
- **Content Security Policy** - Configurado en `next.config.ts`
- **Headers OWASP** - Implementación básica sin helmet (usando headers personalizados)

## 📦 Requisitos Previos

### Variables de Entorno Obligatorias

Crear/actualizar `.env` con:

```

AUTH_SECRET="generar-con-npx-auth-secret"  # Ejecutar: npx auth secret

NEXT_PUBLIC_SITE_URL="https://tusito.vercel.app" o "http://localhost:3000"

AUTH_TRUST_HOST="true"

REQUIRE_EMAIL_VERIFICATION="false"  # true para exigir verificación email

ALLOWED_ORIGINS="http://localhost:3000,https://tusito.vercel.app"

# 2FA / Gmail SMTP (opcional)
GMAIL_USER="tu@gmail.com"
GMAIL_APP_PASSWORD="contraseña-de-aplicacion-de-gmail"

# Configuración de email
REQUIRE_EMAIL_VERIFICATION="false"
```

### Generar App Password de Gmail

1. Ir a [Google Account](https://myaccount.google.com)
2. Security → 2-Step Verification → App passwords
3. Generar password para "Mail"
4. Usar ese password en `GMAIL_APP_PASSWORD`

### Comandos Útiles

```bash
# Desarrollo
npm run dev

# Typecheck
npm run typecheck  # Pasa sin errores

# Build
npm run build      # Compila exitosamente

# Prisma
npm run prisma:generate    # Generar cliente
npm run prisma:migrate     # Migraciones de BD
npm run prisma:seed        # Poblar BD con datos de ejemplo

# Seguridad
# Resetear secretos 2FA si cambia AUTH_SECRET
# Rotar passwords de usuarios
```

## 📦 Estructura del Proyecto

### Arquitectura Clave

- `src/proxy.ts` - Middleware Next.js 16 con seguridad headers + CORS + auth
- `src/app/api/rights/route.ts` - Endpoints GDPR
- `src/lib/logger.ts` - Pino con data masking
- `src/lib/crypto.ts` - Encriptación AES-256-GCM para secretos 2FA
- `src/lib/auth.ts` - NextAuth con rate limiting y 2FA
- `src/app/(admin)/admin/page.tsx` - Panel de administración protegido

### Rutas Protegidas

- `/admin/*` - Solo ADMIN y EDITOR (verificación de role en JWT)
- `/perfil/*` - Cualquier sesión autenticada
- `/api/rights` - Solicitudes GDPR (sin auth requerido)

## 📦 Dependencias Instaladas

| Paquete | Versión | Finalidad |
|---------|---------|-----------|
| `pino` | ^10.3.1 | Logger con data masking |
| `cors` | ^2.8.5 | Configuración CORS |
| `bcryptjs` | ^3.0.3 | Hash de passwords |
| `otplib` | ^13.4.1 | 2FA TOTP |
| `next-themes` | ^0.4.6 | Toggler día/noche |
| `zod` | ^4.4.3 | Validación de schemas |

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor desarrollo |
| `npm run build` | Build producción |
| `npm run typecheck` | Chequeo TypeScript (sin errores) |
| `npm run prisma:generate` | Generar cliente Prisma |
| `npm run prisma:migrate` | Aplicar migraciones BD |
| `npm run prisma:seed` | Poblar BD con datos iniciales |

## 📧 Contacto y Soporte

- **Email de contacto**: apoyo.colombia26@gmail.com
- **Sitio web**: https://apoyocolombia.online
- **Documentación adicional**: Revisar `src/lib/` y `src/app/` para detalles de implementación

---

*última actualización: `2026-08-19` - Versión con todas las prioridades de seguridad implementadas y build compilando exitosamente.*