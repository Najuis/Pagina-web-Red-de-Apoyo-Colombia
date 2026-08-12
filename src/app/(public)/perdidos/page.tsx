import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { LostFilters } from "@/components/lost/lost-filters";
import { LostCard } from "@/components/lost/lost-card";
import { MapView } from "@/components/map/map-view";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Personas y animales perdidos",
  description:
    "Busca o reporta personas y animales perdidos tras el terremoto. Ayúdanos a reunirlos con sus familias.",
};

export default async function PerdidosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string }>;
}) {
  const { q, type, status } = await searchParams;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { lastLocation: { contains: q } },
    ];
  }
  if (type && type !== "ALL") where.type = type;
  if (status && status !== "ALL") where.status = status;

  const reports = await prisma.lostReport.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const mapReports = reports.filter((r) => r.latitude !== null && r.longitude !== null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Personas y animales perdidos"
        subtitle="Juntos podemos ayudarlos a volver a casa. Si tienes información, contacta al reportante."
      />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <LostFilters />
        <Button asChild>
          <Link href="/perdidos/reportar">
            <PlusCircle className="size-4" aria-hidden="true" />
            Reportar pérdida
          </Link>
        </Button>
      </div>

      {mapReports.length > 0 && (
        <Card className="mb-8">
          <CardContent className="p-4">
            <MapView
              locations={mapReports.map((r) => ({
                id: r.id,
                name: r.name,
                type: r.type === "PERSONA" ? "PUNTO_ENCUENTRO" : "CENTRO_ACOPIO",
                latitude: r.latitude!,
                longitude: r.longitude!,
                address: r.lastLocation,
                hours: null,
                phone: null,
                description: r.description,
              }))}
              heightClass="h-[320px]"
            />
          </CardContent>
        </Card>
      )}

      {reports.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <LostCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">No se encontraron reportes</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajusta los filtros o reporta una nueva pérdida.
          </p>
        </div>
      )}
    </div>
  );
}
