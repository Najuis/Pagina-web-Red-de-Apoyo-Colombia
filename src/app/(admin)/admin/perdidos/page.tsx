import { prisma } from "@/lib/prisma";
import { LostAdminTable } from "@/components/admin/lost-admin-table";

export const metadata = {
  title: "Administrar perdidos",
};

export default async function AdminPerdidosPage() {
  const reports = await prisma.lostReport.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Personas y animales perdidos</h1>
        <p className="text-muted-foreground">
          Gestiona los reportes, marca como encontrado o edita los datos.
        </p>
      </div>
      <LostAdminTable reports={reports} />
    </div>
  );
}
