import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { EventsAdminTable } from "@/components/admin/events-admin-table";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Administrar avisos",
};

export default async function AdminAvisosPage() {
  const events = await prisma.event.findMany({
    orderBy: { startAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Avisos y convocatorias</h1>
          <p className="text-muted-foreground">Gestiona voluntariado, donaciones y jornadas de apoyo.</p>
        </div>
        <Button asChild>
          <Link href="/admin/avisos/nueva">
            <PlusCircle className="size-4" aria-hidden="true" />
            Nuevo
          </Link>
        </Button>
      </div>
      <EventsAdminTable events={events} />
    </div>
  );
}
