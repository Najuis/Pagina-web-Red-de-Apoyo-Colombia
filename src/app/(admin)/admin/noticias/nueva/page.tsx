import { ContentForm } from "@/components/forms/content-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Nueva noticia",
};

export default function AdminNuevaNoticiaPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Nueva noticia</h1>
        <p className="text-muted-foreground">Publica una noticia para la red de apoyo.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ContentForm mode="create" kind="NOTICIA" redirectTo="/admin/noticias" />
        </CardContent>
      </Card>
    </div>
  );
}
