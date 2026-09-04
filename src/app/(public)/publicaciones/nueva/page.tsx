import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ContentForm } from "@/components/forms/content-form";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva publicación",
  description: "Comparte una publicación con la red de apoyo.",
};

export default async function NuevaPublicacionPage() {
  const session = await auth();
  const role = session?.user?.role;
  if (!role || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/login?callbackUrl=/publicaciones/nueva");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Nueva publicación"
        subtitle="Comparte algo valioso con la red de apoyo"
      />
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ContentForm mode="create" kind="PUBLICACION" redirectTo="/publicaciones" />
        </CardContent>
      </Card>
    </div>
  );
}
