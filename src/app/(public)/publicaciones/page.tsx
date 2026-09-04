import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/posts/post-card";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { PostFilters } from "@/components/posts/post-filters";
import { auth } from "@/lib/auth";
import { PlusCircle } from "lucide-react";

export const metadata = {
  title: "Publicaciones",
  description: "Publicaciones de la red de apoyo: historias, testimonios y llamados de ayuda.",
};

export const dynamic = "force-dynamic";

export default async function PublicacionesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const session = await auth();
  const canCreate = session?.user?.role === "ADMIN" || session?.user?.role === "EDITOR";

  const where: Record<string, unknown> = { status: "PUBLICADO", kind: "PUBLICACION" };
  if (q) {
    where.OR = [{ title: { contains: q } }, { content: { contains: q } }, { excerpt: { contains: q } }];
  }
  if (category && category !== "ALL") where.category = category;

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        title="Publicaciones"
        subtitle="Historias, testimonios y llamados de apoyo"
      />

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PostFilters />
        {canCreate && (
          <Button asChild>
            <Link href="/publicaciones/nueva">
              <PlusCircle className="size-4" aria-hidden="true" />
              Nueva publicación
            </Link>
          </Button>
        )}
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/publicaciones/${post.slug}`}>
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">No hay publicaciones</p>
          <p className="mt-1 text-sm text-muted-foreground">Ajusta los filtros o crea la primera publicación.</p>
        </div>
      )}
    </div>
  );
}
