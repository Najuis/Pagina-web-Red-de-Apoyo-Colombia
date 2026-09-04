import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ItemCard } from "@/components/items/item-card";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { ItemFilters } from "@/components/items/item-filters";
import { auth } from "@/lib/auth";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Insumos y servicios",
  description: "Directorio de insumos y ayuda disponible: alimentos, agua, albergue, transporte y más.",
};

export const dynamic = "force-dynamic";

export default async function InsumosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const session = await auth();

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [{ name: { contains: q } }, { description: { contains: q } }, { location: { contains: q } }];
  }
  if (category && category !== "ALL") where.category = category;

  const items = await prisma.item.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Insumos y Ayuda"
        subtitle="Lo que la red de apoyo ofrece y comparte"
      />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <ItemFilters />
        <Button asChild>
          <Link href={session?.user ? "/insumos/nuevo" : "/login?callbackUrl=/insumos/nuevo"}>
            <PlusCircle className="size-4" aria-hidden="true" />
            Nuevo
          </Link>
        </Button>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">No hay resultados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajusta los filtros o publica el primer insumo/servicio.
          </p>
        </div>
      )}
    </div>
  );
}
