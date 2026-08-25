import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SectionHeader } from "@/components/layout/section-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LostCard } from "@/components/lost/lost-card";
import { ItemCard } from "@/components/items/item-card";
import { TwoFactorSection } from "@/components/auth/two-factor-section";
import { timeAgo } from "@/lib/format";
import { ROLES } from "@/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi perfil",
  description: "Tu información y actividad en la red de apoyo.",
};

export default async function PerfilPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id as string },
    include: {
      lostReports: { orderBy: { createdAt: "desc" } },
      items: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader title={`Hola, ${user.name}`} subtitle="Tu actividad en la red de apoyo" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-heading text-lg">Información</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Email verificado:</span>
              {user.emailVerified ? (
                <Badge variant="default">Sí</Badge>
              ) : (
                <Badge variant="outline">No</Badge>
              )}
            </p>
            <p>
              <span className="font-medium">Rol:</span>{" "}
              {ROLES.includes(user.role as (typeof ROLES)[number]) ? user.role : "Usuario"}
            </p>
            <p>
              <span className="font-medium">Miembro desde:</span> {timeAgo(user.createdAt)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-lg">Seguridad</CardTitle>
          </CardHeader>
          <CardContent>
            <TwoFactorSection initiallyEnabled={user.twoFactorEnabled} />
          </CardContent>
        </Card>

        <div className="space-y-8 lg:col-span-2">
          <div>
            <h2 className="font-heading mb-4 text-lg font-semibold">
              Mis reportes de pérdidas ({user.lostReports.length})
            </h2>
            {user.lostReports.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {user.lostReports.map((report) => (
                  <LostCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no has reportado pérdidas.</p>
            )}
          </div>

          <div>
            <h2 className="font-heading mb-4 text-lg font-semibold">
              Mis publicaciones de insumos ({user.items.length})
            </h2>
            {user.items.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {user.items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aún no has publicado insumos o servicios.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
