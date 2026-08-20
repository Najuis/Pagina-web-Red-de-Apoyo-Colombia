import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "Usuarios",
};

export default async function AdminUsuariosPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
      twoFactorEnabled: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Usuarios registrados</h1>
        <p className="text-muted-foreground">Gestiona los usuarios de la plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay usuarios registrados</p>
          ) : (
            <div className="overflow-x-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {users.map((user) => {
                  const emailVerified = user.emailVerified
                    ? formatDate(user.emailVerified)
                    : "No verificado";
                  const twoFA = user.twoFactorEnabled ? "Activado" : "Desactivado";
                  const isActiveBadge = user.isActive
                    ? <Badge variant="secondary">Activo</Badge>
                    : <Badge variant="destructive">Inactivo</Badge>;

                  return (
                    <div key={user.id} className="group border rounded-lg p-4 hover:bg-muted/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="w-12 rounded bg-muted flex items-center justify-center">
                          <span className="font-bold text-lg">{user.name.slice(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">Rol:</span>
                          <Badge variant={user.role === "ADMIN" ? "destructive" : "outline"}>
                            {user.role}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-xs text-muted-fecha">2FA:</span>
                          <span>{twoFA}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-fecha">Estado:</span>
                          {isActiveBadge}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`/admin/usuarios/${user.id}/editar`, "_blank")}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => window.alert("Eliminar usuario - implementar confirmación")}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}