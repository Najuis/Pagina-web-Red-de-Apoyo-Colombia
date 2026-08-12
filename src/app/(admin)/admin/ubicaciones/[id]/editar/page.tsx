import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LocationForm } from "@/components/forms/location-form";
import { Card, CardContent } from "@/components/ui/card";
import type { MapLocationInput } from "@/lib/validations";

export const metadata = {
  title: "Editar ubicación",
};

export default async function AdminEditarUbicacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await prisma.mapLocation.findUnique({ where: { id } });
  if (!location) notFound();

  const initial: MapLocationInput & { id: string } = {
    id: location.id,
    name: location.name,
    type: location.type as MapLocationInput["type"],
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    hours: location.hours,
    phone: location.phone,
    description: location.description,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Editar ubicación</h1>
        <p className="text-muted-foreground">Actualiza los datos de la ubicación.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <LocationForm mode="edit" initial={initial} redirectTo="/admin/ubicaciones" />
        </CardContent>
      </Card>
    </div>
  );
}
