import Link from "next/link";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/layout/section-header";
import { PostCard } from "@/components/posts/post-card";
import { LostCard } from "@/components/lost/lost-card";
import { ItemCard } from "@/components/items/item-card";
import { EventCard } from "@/components/events/event-card";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Búsqueda",
  description: "Busca en toda la plataforma de apoyo.",
};

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const posts = query
    ? await prisma.post.findMany({
        where: {
          status: "PUBLICADO",
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
            { excerpt: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { author: { select: { name: true } } },
      })
    : [];

  const lost = query
    ? await prisma.lostReport.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { lastLocation: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  const items = query
    ? await prisma.item.findMany({
        where: {
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
            { location: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 6,
      })
    : [];

  const events = query
    ? await prisma.event.findMany({
        where: {
          OR: [{ title: { contains: query } }, { description: { contains: query } }],
          startAt: { gte: new Date() },
        },
        orderBy: { startAt: "asc" },
        take: 4,
      })
    : [];

  const total = posts.length + lost.length + items.length + events.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title="Búsqueda" subtitle="Encuentra lo que necesitas en la red de apoyo" />

      <form action="/buscar" method="get" className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            name="q"
            placeholder="Buscar publicaciones, noticias, perdidos, insumos, avisos..."
            defaultValue={query}
            className="h-12 pl-11 text-base"
            autoFocus
          />
        </div>
      </form>

      {!query && (
        <div className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
          Escribe un término para buscar en toda la plataforma.
        </div>
      )}

      {query && total === 0 && (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <p className="font-heading text-lg font-semibold">Sin resultados para «{query}»</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba con otras palabras.</p>
        </div>
      )}

      {posts.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading mb-4 text-xl font-semibold">
            Publicaciones y noticias ({posts.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/${post.kind === "NOTICIA" ? "noticias" : "publicaciones"}/${post.slug}`}>
                <PostCard post={post} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {lost.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading mb-4 text-xl font-semibold">
            Perdidos ({lost.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lost.map((report) => (
              <LostCard key={report.id} report={report} />
            ))}
          </div>
        </section>
      )}

      {items.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading mb-4 text-xl font-semibold">
            Insumos y servicios ({items.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="mb-10">
          <h2 className="font-heading mb-4 text-xl font-semibold">
            Avisos próximos ({events.length})
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {events.map((event) => (
              <div key={event.id}>
                <p className="mb-1 text-xs font-semibold uppercase text-primary">
                  {formatDate(event.startAt, "EEE d MMM")}
                </p>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
