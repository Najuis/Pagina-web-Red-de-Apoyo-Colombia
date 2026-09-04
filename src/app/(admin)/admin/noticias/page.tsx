import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostsAdminTable } from "@/components/admin/posts-admin-table";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Administrar noticias",
};

export default async function AdminNoticiasPage() {
  const posts = await prisma.post.findMany({
    where: { kind: "NOTICIA" },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Noticias</h1>
          <p className="text-muted-foreground">Gestiona el portal de noticias.</p>
        </div>
        <Button asChild>
          <Link href="/admin/noticias/nueva">
            <PlusCircle className="size-4" aria-hidden="true" />
            Nueva
          </Link>
        </Button>
      </div>
      <PostsAdminTable posts={posts} basePath="/admin/noticias" />
    </div>
  );
}
