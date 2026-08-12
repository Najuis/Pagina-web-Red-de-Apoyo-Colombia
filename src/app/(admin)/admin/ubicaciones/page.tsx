import Link from "next/link";
import { PlusCircle, Pencil as PencilIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLocation } from "@/app/actions/location-actions";
import { LOCATION_TYPE_LABELS } from "@/types";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Administrar ubicaciones",
};

export default async function AdminUbicacionesPage() {
  const locations = await prisma.mapLocation.findMany({
    orderBy: { type: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Ubicaciones</h1>
          <p className="text-muted-foreground">Gestiona los puntos del mapa.</p>
        </div>
        <Button asChild>
          <Link href="/admin/ubicaciones/nueva">
            <PlusCircle className="size-4" aria-hidden="true" />
            Nueva
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="font-medium">{loc.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {LOCATION_TYPE_LABELS[loc.type as keyof typeof LOCATION_TYPE_LABELS] ?? loc.type}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-[240px] truncate text-sm text-muted-foreground">
                  {loc.address ?? `(${loc.latitude}, ${loc.longitude})`}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="icon" aria-label="Editar">
                      <Link href={`/admin/ubicaciones/${loc.id}/editar`}>
                        <PencilIcon />
                      </Link>
                    </Button>
                    <DeleteButton action={deleteLocation} id={loc.id} label="¿Eliminar esta ubicación?" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
