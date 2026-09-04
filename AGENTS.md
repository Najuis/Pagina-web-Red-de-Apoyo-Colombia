# AGENTS.md - Red de Apoyo Colombia

## Dev Container
- **Command**: `devcontainer up` or open in VS Code
- **Port**: 3000 (Next.js dev server, auto-forwarded)
- **Post-create**: `npm install && npm run prisma:generate`
- **Post-start**: `npx prisma migrate deploy || true && npm run dev`
- **Extensions recommended**: ESLint, Prettier, Prisma, Tailwind CSS, TypeScript Nightly

## Stack
- **Next.js 16** + React 19 + TypeScript estricto
- **Prisma 6.19.3 + PostgreSQL** (Neon) via `DATABASE_URL`
- **NextAuth v5** (beta.32) con `Credentials` + sesiones JWT

## Comandos esenciales

| Propósito | Comando |
|---|---|
| Servidor desarrollo | `npm run dev` |
| Build producción | `npm run build` |
| Lint (ESLint plano) | `npm run lint` |
| Typecheck (`tsc --noEmit`) | `npm run typecheck` |
| Prisma generate | `npm run prisma:generate` |
| Prisma migrate | `npm run prisma:migrate` |
| Prisma seed (admin/editor) | `npm run prisma:seed` |

**Orden importa**: `lint → typecheck → build`. El script `build` es `prisma generate && next build`; `migrate deploy` requiere ejecución manual después del deploy.

## Gotchas de Next.js 16
- `params` y `searchParams` son `Promise` en páginas/layouts: `const { id } = await params`
- **`AUTH_SECRET` obligatorio**: NextAuth lanza `MissingSecret` si no está definido. Definir en `devcontainer.json` y vars de Vercel.

## Vercel
- `vercel.json` en la raíz: `buildCommand: npm run build`, `devCommand: npm run dev`, `framework: nextjs`.
- **Ojo**: El `build` de Vercel corre `prisma generate && next build` (solo). `migrate deploy` **no** está incluido. Las migraciones de producción se deben ejecutar manualmente después del deploy con `npm run prisma:migrate`.
- Variables de entorno en la dashboard de Vercel: `DATABASE_URL`, `AUTH_SECRET`, `GMAIL_USER`, `GMAIL_APP_PASSWORD`, etc.

## TypeScript / Estilo
- **Estricto**: no usar `any` (el único `as unknown as` aceptado es el de `zodResolver` internamente).
- Textos en español.