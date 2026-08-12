import { ContentForm } from "@/components/forms/content-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Nueva publicación",
};

export default function AdminNuevaPublicacionPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nueva publicación</h1>
        <p className="text-muted-foreground">Crea una publicación para la red de apoyo.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ContentForm mode="create" kind="PUBLICACION" redirectTo="/admin/publicaciones" />
        </CardContent>
      </Card>
    </div>
  );
}
