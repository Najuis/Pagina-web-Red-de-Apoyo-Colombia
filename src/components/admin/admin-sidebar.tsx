"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  HeartHandshake,
  Newspaper,
  CalendarDays,
  Search,
  Package,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/publicaciones", label: "Publicaciones", Icon: HeartHandshake },
  { href: "/admin/noticias", label: "Noticias", Icon: Newspaper },
  { href: "/admin/avisos", label: "Avisos", Icon: CalendarDays },
  { href: "/admin/perdidos", label: "Perdidos", Icon: Search },
  { href: "/admin/insumos", label: "Insumos y ayuda", Icon: Package },
  { href: "/admin/ubicaciones", label: "Ubicaciones", Icon: MapPin },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Panel de administración">
      {links.map(({ href, label, Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
