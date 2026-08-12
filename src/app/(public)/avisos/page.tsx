import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/events/event-card";
import { EventFilters } from "@/components/events/event-filters";
import { SectionHeader } from "@/components/layout/section-header";

export const metadata = {
  title: "Avisos y convocatorias",
  description: "Voluntariado, donaciones, jornadas de ayuda y capacitación tras el terremoto del 10 de agosto de 2026.",
};

export default async function AvisosPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  const where: Record<string, unknown> = { startAt: { gte: new Date() } };
  if (type && type !== "ALL") where.type = type;

  const events = await prisma.event.findMany({
    where,
    orderBy: { startAt: "asc" },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Avisos y convocatorias"
        subtitle="Voluntariado, donaciones y jornadas de apoyo"
      />

      <div className="mb-6">
        <EventFilters />
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">No hay convocatorias próximas</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Consulta pronto la agenda actualizada de la red de apoyo.
          </p>
        </div>
      )}
    </div>
  );
}
