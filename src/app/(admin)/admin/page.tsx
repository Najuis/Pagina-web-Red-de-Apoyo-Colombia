import Link from "next/link";
import {
  HeartHandshake,
  Newspaper,
  CalendarDays,
  Search,
  Package,
  MapPin,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { POST_STATUS_LABELS, POST_CATEGORY_LABELS } from "@/types";

export const metadata = {
  title: "Panel de administración",
  description: "Administra el contenido de la plataforma de apoyo ante desastres.",
};

export default async function AdminDashboardPage() {
  const [posts, news, events, lost, items, locations, recentPosts] = await Promise.all([
    prisma.post.count({ where: { kind: "PUBLICACION" } }),
    prisma.post.count({ where: { kind: "NOTICIA" } }),
    prisma.event.count(),
    prisma.lostReport.count(),
    prisma.item.count(),
    prisma.mapLocation.count(),
    prisma.post.findMany({
      where: { status: "BORRADOR" },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
  ]);

  const stats = [
    { label: "Publicaciones", value: posts, href: "/admin/publicaciones", Icon: HeartHandshake },
    { label: "Noticias", value: news, href: "/admin/noticias", Icon: Newspaper },
    { label: "Avisos", value: events, href: "/admin/avisos", Icon: CalendarDays },
    { label: "Perdidos", value: lost, href: "/admin/perdidos", Icon: Search },
    { label: "Insumos", value: items, href: "/admin/insumos", Icon: Package },
    { label: "Ubicaciones", value: locations, href: "/admin/ubicaciones", Icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen del contenido de la plataforma.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ label, value, href, Icon }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                <Icon className="size-6 text-primary" aria-hidden="true" />
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Borradores pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentPosts.length > 0 ? (
            <ul className="divide-y">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {POST_CATEGORY_LABELS[post.category as keyof typeof POST_CATEGORY_LABELS] ?? post.category} ·{" "}
                      {formatDate(post.updatedAt)} · {post.author?.name}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Badge variant="outline">{POST_STATUS_LABELS.BORRADOR}</Badge>
                    <Link
                      href={`/admin/publicaciones/${post.id}/editar`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No hay borradores pendientes.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
