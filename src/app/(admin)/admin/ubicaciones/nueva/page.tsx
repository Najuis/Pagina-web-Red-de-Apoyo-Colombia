import { LocationForm } from "@/components/forms/location-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Nueva ubicación",
};

export default function AdminNuevaUbicacionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nueva ubicación</h1>
        <p className="text-muted-foreground">Agrega un punto de ayuda al mapa.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <LocationForm mode="create" redirectTo="/admin/ubicaciones" />
        </CardContent>
      </Card>
    </div>
  );
}
