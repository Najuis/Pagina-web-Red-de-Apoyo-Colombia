import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItemForm } from "@/components/forms/item-form";
import { Card, CardContent } from "@/components/ui/card";
import type { ItemInput } from "@/lib/validations";

export const metadata = {
  title: "Editar insumo/servicio",
};

export default async function AdminEditarInsumoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) notFound();

  const initial: ItemInput & { id: string } = {
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category as ItemInput["category"],
    image: item.image,
    price: item.price,
    location: item.location,
    contactType: item.contactType as ItemInput["contactType"],
    contactValue: item.contactValue,
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Editar insumo/servicio</h1>
        <p className="text-muted-foreground">Actualiza los datos del insumo.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ItemForm mode="edit" initial={initial} redirectTo="/admin/insumos" />
        </CardContent>
      </Card>
    </div>
  );
}
