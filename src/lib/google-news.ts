import Parser from "rss-parser";
import { siteConfig } from "@/lib/site.config";

const parser = new Parser();

export type GoogleNewsItem = {
  title: string;
  link: string;
  source: string;
  publishedAt: string | null;
};

function buildRssUrl(query: string): string {
  const params = new URLSearchParams({
    q: query,
    hl: siteConfig.googleNews.language,
    gl: siteConfig.googleNews.region,
    ceid: `${siteConfig.googleNews.region}:${siteConfig.googleNews.language}`,
  });
  return `https://news.google.com/rss/search?${params.toString()}`;
}

export async function fetchGoogleNews(query: string): Promise<GoogleNewsItem[]> {
  const res = await fetch(buildRssUrl(query), {
    cache: "force-cache",
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Red-de-Apoyo-Colombia/1.0)",
    },
  });
  if (!res.ok) {
    throw new Error(`Google News RSS falló: ${res.status}`);
  }

  const feed = await parser.parseString(await res.text());
  return feed.items
    .filter((item): item is Parser.Item & { link: string; title: string } => Boolean(item.link && item.title))
    .slice(0, siteConfig.googleNews.resultLimit)
    .map((item) => ({
      title: item.title,
      link: item.link,
      source: item.creator ?? "Google Noticias",
      publishedAt: item.isoDate ?? item.pubDate ?? null,
    }));
}

export async function fetchGoogleNewsAll(): Promise<GoogleNewsItem[]> {
  const results = await Promise.allSettled(
    siteConfig.googleNews.queries.map((query) => fetchGoogleNews(query))
  );

  const items = results.flatMap((result) => {
    if (result.status === "fulfilled") return result.value;
    console.error(`Feed de Google News falló: ${result.reason}`);
    return [];
  });

  const seen = new Set<string>();
  const uniqueByLink: GoogleNewsItem[] = [];
  for (const item of items) {
    if (!seen.has(item.link)) {
      seen.add(item.link);
      uniqueByLink.push(item);
    }
  }

  return uniqueByLink.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}