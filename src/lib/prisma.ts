import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl(): string {
  // Detectar build time: NEXT_PHASE (Next.js 13+) o VERCEL_ENV + npm run build
  const isBuildTime =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NEXT_PHASE === "phase-export" ||
    (process.env.VERCEL_ENV === "production" && process.env.npm_lifecycle_event === "build") ||
    process.env.CI === "true";

  return isBuildTime
    ? process.env.DIRECT_DATABASE_URL!
    : process.env.DATABASE_URL!;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: { url: getDatabaseUrl() },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
