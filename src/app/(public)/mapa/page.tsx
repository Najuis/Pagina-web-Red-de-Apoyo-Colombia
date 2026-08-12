import { prisma } from "@/lib/prisma";
import { MapSection } from "@/components/map/map-section";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata = {
  title: "Mapa de apoyo",
  description: "Encuentra centros de acopio, albergues, centros de salud y puntos de ayuda tras la emergencia.",
};

export default async function MapaPage() {
  const locations = await prisma.mapLocation.findMany({
    orderBy: { type: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Mapa de apoyo"
        subtitle="Centros de acopio, albergues y puntos de ayuda en Eje Cafetero y Cauca"
      />

      <MapSection locations={locations} />
    </div>
  );
}
