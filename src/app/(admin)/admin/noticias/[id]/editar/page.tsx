import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentForm } from "@/components/forms/content-form";
import { Card, CardContent } from "@/components/ui/card";
import type { PostInput } from "@/lib/validations";

export const metadata = {
  title: "Editar noticia",
};

export default async function AdminEditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post || post.kind !== "NOTICIA") notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Editar noticia</h1>
        <p className="text-muted-foreground">Actualiza los datos de la noticia.</p>
      </div>
      <Card>
        <CardContent className="p-6 sm:p-8">
          <ContentForm
            mode="edit"
            kind="NOTICIA"
            redirectTo="/admin/noticias"
            initial={{
              id: post.id,
              title: post.title,
              slug: post.slug,
              content: post.content,
              excerpt: post.excerpt ?? "",
              image: post.image,
              kind: post.kind as PostInput["kind"],
              category: post.category as PostInput["category"],
              status: post.status as PostInput["status"],
              featured: post.featured,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
