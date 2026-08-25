import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LostForm } from "@/components/forms/lost-form";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reportar una pérdida",
  description: "Reporta una persona o animal perdido para que la red de apoyo te ayude.",
};

export default async function ReportarPerdidaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/perdidos/reportar");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Reportar una pérdida"
        subtitle="Completa el formulario con el mayor detalle posible. Cada dato ayuda."
      />
      <Card>
        <CardContent className="p-6 sm:p-8">
          <LostForm mode="create" redirectTo="/perdidos" />
        </CardContent>
      </Card>
    </div>
  );
}
