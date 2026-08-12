import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PostDetail } from "@/components/posts/post-detail";

type Props = {
  params: Promise<{ slug: string }>;
};

async function getPost(slug: string, kind: string) {
  return prisma.post.findFirst({
    where: { slug, kind, status: "PUBLICADO" },
    include: { author: { select: { name: true } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug, "NOTICIA");
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt ?? post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.content.slice(0, 160),
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug, "NOTICIA");
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground" aria-label="Miga de pan">
        <Link href="/" className="transition hover:text-foreground">
          Inicio
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href="/noticias" className="transition hover:text-foreground">
          Noticias
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-foreground">{post.title.slice(0, 40)}</span>
      </nav>

      <PostDetail post={post} />

      <div className="mt-10 border-t pt-6 text-center">
        <Link href="/noticias" className="text-sm font-medium text-primary hover:underline">
          ← Ver todas las noticias
        </Link>
      </div>
    </div>
  );
}
