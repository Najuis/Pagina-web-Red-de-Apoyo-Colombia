import Link from "next/link";
import { Newspaper, Search, CalendarDays, MapPin, HeartHandshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const items = [
  {
    href: "/perdidos",
    label: "Buscar perdidos",
    description: "Personas y animales que buscamos juntos tras la emergencia.",
    Icon: Search,
  },
  {
    href: "/insumos",
    label: "Insumos y Ayuda",
    description: "Alimentos, agua, albergue, transporte y más.",
    Icon: HeartHandshake,
  },
  {
    href: "/noticias",
    label: "Noticias",
    description: "Alertas e información sobre el terremoto y su atención.",
    Icon: Newspaper,
  },
  {
    href: "/avisos",
    label: "Avisos",
    description: "Convocatorias de voluntariado, donaciones y jornadas.",
    Icon: CalendarDays,
  },
  {
    href: "/mapa",
    label: "Mapa",
    description: "Centros de acopio, albergues y puntos de ayuda.",
    Icon: MapPin,
  },
];

export function QuickAccess() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {items.map(({ href, label, description, Icon }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-all group-hover:-translate-y-1 group-hover:shadow-lg">
              <CardContent className="flex h-full flex-col items-center p-5 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-3 font-heading text-base font-semibold">{label}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
