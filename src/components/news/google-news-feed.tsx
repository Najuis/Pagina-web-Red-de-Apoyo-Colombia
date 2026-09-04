import Link from "next/link";
import { ExternalLink, Newspaper } from "lucide-react";
import { fetchGoogleNewsAll } from "@/lib/google-news";
import { timeAgo } from "@/lib/format";
import { SectionHeader } from "@/components/layout/section-header";
import { siteConfig } from "@/lib/site.config";

export async function GoogleNewsFeed() {
  const items = await fetchGoogleNewsAll();
  const visibleItems = items.slice(0, siteConfig.googleNews.resultLimit);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="En las noticias"
          subtitle="Titulares recientes sobre la emergencia en Colombia, vía Google Noticias"
        />

        {visibleItems.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {visibleItems.map((item) => (
              <li key={item.link}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <p className="line-clamp-3 font-medium leading-snug group-hover:text-primary">
                    {item.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <Newspaper className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.source}</span>
                    </span>
                    {item.publishedAt && (
                      <span className="shrink-0">{timeAgo(item.publishedAt)}</span>
                    )}
                    <ExternalLink
                      className="size-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <p className="font-heading text-lg font-semibold">
              No pudimos cargar los titulares
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Intenta de nuevo más tarde o visita{" "}
              <Link
                href="https://news.google.com/search?q=terremoto%20Colombia&hl=es-419&gl=CO"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Google Noticias
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}