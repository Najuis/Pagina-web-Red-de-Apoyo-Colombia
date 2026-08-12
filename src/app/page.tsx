import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site.config";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { QuickAccess } from "@/components/home/quick-access";
import { SectionHeader } from "@/components/layout/section-header";
import { PostCard } from "@/components/posts/post-card";
import { EventCard } from "@/components/events/event-card";
import { SocialLinks } from "@/components/layout/social-links";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function HomePage() {
  const [featuredPosts, recentPosts, news, upcomingEvents] = await Promise.all([
    prisma.post.findMany({
      where: { status: "PUBLICADO", featured: true },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.findMany({
      where: { status: "PUBLICADO", kind: "PUBLICACION" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { author: { select: { name: true } } },
    }),
    prisma.post.findMany({
      where: { status: "PUBLICADO", kind: "NOTICIA" },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { author: { select: { name: true } } },
    }),
    prisma.event.findMany({
      where: { startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 3,
    }),
  ]);

  const heroPosts = featuredPosts.length > 0 ? featuredPosts : recentPosts;

  return (
    <>
      <HeroCarousel posts={heroPosts} />

      <QuickAccess />

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Publicaciones recientes"
            subtitle="Historias, testimonios y llamados de apoyo"
            href="/publicaciones"
          />
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <Link key={post.id} href={`/publicaciones/${post.slug}`}>
                  <PostCard post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aún no hay publicaciones"
              description="Sé el primero en compartir algo con la red de apoyo."
            />
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Próximas convocatorias"
            subtitle="Voluntariado, donaciones y jornadas de apoyo"
            href="/avisos"
          />
          {upcomingEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hay convocatorias próximas"
              description="Consulta la agenda completa de la red de apoyo."
            />
          )}
        </div>
      </section>

      <section className="bg-muted/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title="Últimas noticias" href="/noticias" />
          {news.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.map((post) => (
                <Link key={post.id} href={`/noticias/${post.slug}`}>
                  <PostCard post={post} />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Sin noticias por ahora"
              description="Pronto publicaremos nuevas noticias."
            />
          )}
        </div>
      </section>

      <SocialBanner />
    </>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed p-12 text-center">
      <p className="font-heading text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function SocialBanner() {
  return (
    <section className="bg-gradient-to-r from-primary via-primary/90 to-primary">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
          Síguenos en nuestras redes
        </h2>
        <p className="max-w-xl text-white/85">
          Mantente al día con las novedades de {siteConfig.name}. Únete a la conversación
          y comparte con toda la red de apoyo.
        </p>
        <SocialLinks className="[&>a]:bg-white/15 [&>a]:text-white [&>a]:hover:bg-secondary [&>a]:hover:text-secondary-foreground" />
        <Button asChild variant="secondary">
          <Link href="/avisos">Conoce las convocatorias activas</Link>
        </Button>
      </div>
    </section>
  );
}
