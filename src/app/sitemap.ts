import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site.config";

const staticRoutes = [
  "",
  "/publicaciones",
  "/perdidos",
  "/insumos",
  "/noticias",
  "/avisos",
  "/mapa",
  "/buscar",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, events] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLICADO" },
      select: { slug: true, kind: true, updatedAt: true },
    }),
    prisma.event.findMany({
      select: { id: true, updatedAt: true },
    }),
  ]);

  const base = siteConfig.url;

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...posts.map((post) => ({
      url: `${base}/${post.kind === "NOTICIA" ? "noticias" : "publicaciones"}/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...events.map((event) => ({
      url: `${base}/avisos`,
      lastModified: event.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
  ];
}
