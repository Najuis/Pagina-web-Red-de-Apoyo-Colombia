import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/forms/event-form";
import { Card, CardContent } from "@/components/ui/card";
import type { EventInput } from "@/lib/validations";

export const metadata = {
  title: "Editar aviso",
};

export default async function AdminEditarAvisoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const initial: EventInput & { id: string } = {
    id: event.id,
    title: event.title,
    description: event.description,
    type: event.type as EventInput["type"],
    location: event.location,
    image: event.image,
    startAt: event.startAt,
    endAt: event.endAt,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Editar aviso</h1>
        <p className="text-muted-foreground">Actualiza los datos del aviso.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <EventForm mode="edit" initial={initial} redirectTo="/admin/avisos" />
        </CardContent>
      </Card>
    </div>
  );
}
