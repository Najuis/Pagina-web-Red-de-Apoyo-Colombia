import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ItemForm } from "@/components/forms/item-form";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Publicar insumo/servicio",
  description: "Publica un insumo o ayuda disponible para la red de apoyo.",
};

export default async function NuevoInsumoPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/insumos/nuevo");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Publicar insumo o servicio"
        subtitle="Comparte lo que ofreces o necesitas con la red de apoyo"
      />
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ItemForm mode="create" redirectTo="/insumos" />
        </CardContent>
      </Card>
    </div>
  );
}
