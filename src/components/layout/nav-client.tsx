"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

type NavItem = { href: string; label: string };

type NavUser = {
  name: string;
  email: string;
  image: string | null;
  role: Role;
};

export function NavClient({
  navItems,
  user,
}: {
  navItems: readonly NavItem[];
  user: NavUser | null;
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const isAdmin = user?.role === "ADMIN" || user?.role === "EDITOR";

  return (
    <>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Button
              key={item.href}
              asChild
              variant={active ? "secondary" : "ghost"}
              className="text-sm"
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          <Sun className="size-5 dark:hidden" aria-hidden="true" />
          <Moon className="hidden size-5 dark:block" aria-hidden="true" />
        </Button>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full p-1 outline-none transition hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Menú de usuario"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="truncate font-medium">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 size-4" aria-hidden="true" />
                    Panel de administración
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/perfil">
                  <UserIcon className="mr-2 size-4" aria-hidden="true" />
                  Mi perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/api/auth/signout">
                  <LogOut className="mr-2 size-4" aria-hidden="true" />
                  Cerrar sesión
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild variant="default" className="hidden sm:inline-flex">
            <Link href="/login">Iniciar sesión</Link>
          </Button>
        )}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle>Menú</SheetTitle>
            </SheetHeader>
            <nav className="mt-4 flex flex-col gap-1" aria-label="Móvil">
              {navItems.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-muted",
                      active && "bg-muted text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-2">
                  <p className="px-1 text-sm font-medium">{user.name}</p>
                  {isAdmin && (
                    <Button asChild variant="outline" onClick={() => setOpen(false)}>
                      <Link href="/admin">Panel de administración</Link>
                    </Button>
                  )}
                  <Button asChild variant="ghost" onClick={() => setOpen(false)}>
                    <Link href="/api/auth/signout">Cerrar sesión</Link>
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full" onClick={() => setOpen(false)}>
                  <Link href="/login">Iniciar sesión</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
