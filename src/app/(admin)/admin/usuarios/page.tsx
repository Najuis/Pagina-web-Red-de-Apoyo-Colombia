import { prisma } from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserActiveToggle } from "@/components/admin/user-active-toggle";

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
      <div className="rounded-lg border border-amber-300 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
        <span className="font-semibold">Administración de usuarios</span> — aquí puedes ver la
        existencia de cada usuario, su rol y sus permisos, y activar o desactivar su acceso.
      </div>
      <div>
        <h1 className="font-heading text-2xl font-bold">Usuarios registrados</h1>
        <p className="text-muted-foreground">
          Un usuario desactivado no podrá iniciar sesión hasta que lo actives de nuevo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay usuarios registrados</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="space-y-3 rounded-lg border p-4 transition hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted">
                      <span className="font-bold">{user.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "destructive"
                          : user.role === "EDITOR"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {user.role}
                    </Badge>
                    <Badge variant={user.twoFactorEnabled ? "default" : "outline"}>
                      2FA: {user.twoFactorEnabled ? "Activado" : "Desactivado"}
                    </Badge>
                    {user.isActive ? (
                      <Badge variant="secondary">Activo</Badge>
                    ) : (
                      <Badge variant="destructive">Inactivo</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      {user.emailVerified ? "Email verificado" : "Email sin verificar"}
                    </span>
                    <UserActiveToggle userId={user.id} isActive={user.isActive} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}