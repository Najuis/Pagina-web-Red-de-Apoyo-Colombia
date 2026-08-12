import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site.config";

// Google News Sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLICADO", kind: "NOTICIA" },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  const urlset = posts
    .map((post) => {
      const loc = `${siteConfig.url}/noticias/${escapeXml(post.slug)}`;
      const title = escapeXml(post.title);
      const date = new Date(post.createdAt).toISOString();
      return `  <url>
    <loc>${loc}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(siteConfig.name)}</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${date}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlset}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}