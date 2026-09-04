import { prisma } from "@/lib/prisma";
import { ItemsAdminTable } from "@/components/admin/items-admin-table";

export const metadata = {
  title: "Administrar insumos y servicios",
};

export default async function AdminInsumosPage() {
  const items = await prisma.item.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Insumos y servicios</h1>
        <p className="text-muted-foreground">Gestiona el directorio comunitario.</p>
      </div>
      <ItemsAdminTable items={items} />
    </div>
  );
}
