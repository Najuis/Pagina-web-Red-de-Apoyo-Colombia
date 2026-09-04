import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/posts/post-card";
import { SectionHeader } from "@/components/layout/section-header";
import { PostFilters } from "@/components/posts/post-filters";
import { GoogleNewsFeed } from "@/components/news/google-news-feed";

export const metadata = {
  title: "Noticias",
  description: "Últimas noticias y alertas sobre la emergencia en Eje Cafetero y Cauca.",
};

export const dynamic = "force-dynamic";

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const where: Record<string, unknown> = { status: "PUBLICADO", kind: "NOTICIA" };
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
      <SectionHeader title="Noticias" subtitle="Alertas e información sobre la emergencia" />
      <div className="mb-6">
        <PostFilters />
      </div>

      {posts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/noticias/${post.slug}`}>
              <PostCard post={post} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">No hay noticias aún</p>
          <p className="mt-1 text-sm text-muted-foreground">Vuelve pronto para leer las novedades.</p>
        </div>
      )}

      <div className="mt-16">
        <GoogleNewsFeed />
      </div>
    </div>
  );
}
