import { EventForm } from "@/components/forms/event-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Nuevo aviso",
};

export default function AdminNuevoAvisoPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nuevo aviso</h1>
        <p className="text-muted-foreground">Crea un aviso o convocatoria para la red de apoyo.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <EventForm mode="create" redirectTo="/admin/avisos" />
        </CardContent>
      </Card>
    </div>
  );
}
