import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostsAdminTable } from "@/components/admin/posts-admin-table";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Administrar publicaciones",
};

export default async function AdminPublicacionesPage() {
  const posts = await prisma.post.findMany({
    where: { kind: "PUBLICACION" },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Publicaciones</h1>
          <p className="text-muted-foreground">Gestiona las publicaciones de la red de apoyo.</p>
        </div>
        <Button asChild>
          <Link href="/admin/publicaciones/nueva">
            <PlusCircle className="size-4" aria-hidden="true" />
            Nueva
          </Link>
        </Button>
      </div>
      <PostsAdminTable posts={posts} basePath="/admin/publicaciones" />
    </div>
  );
}
