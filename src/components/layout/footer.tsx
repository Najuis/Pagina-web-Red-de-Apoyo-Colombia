import Link from "next/link";
import { HeartHandshake, Mail, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/lib/site.config";
import { SocialLinks } from "@/components/layout/social-links";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const footerLinks = [
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/perdidos", label: "Personas y animales perdidos" },
  { href: "/insumos", label: "Insumos y ayuda" },
  { href: "/noticias", label: "Noticias" },
  { href: "/avisos", label: "Avisos y convocatorias" },
  { href: "/mapa", label: "Mapa y puntos de ayuda" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartHandshake className="size-5" aria-hidden="true" />
            </span>
            <span className="font-heading text-lg font-bold">{siteConfig.name}</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{siteConfig.description}</p>
          <SocialLinks className="mt-4" />
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
            Enlaces rápidos
          </h3>
          <ul className="mt-4 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground transition hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {siteConfig.contact.address}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              {siteConfig.contact.email}
            </li>
            <li className="flex items-center gap-2">
              <Clock className="size-4 shrink-0" aria-hidden="true" />
              {siteConfig.contact.hours}
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide">
            Ubicación
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">{siteConfig.contact.address}</p>
          <ButtonAsLink />
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.name}. Todos los derechos reservados.
          </p>
          <p>Hecho con solidaridad.</p>
        </div>
      </div>
    </footer>
  );
}

function ButtonAsLink() {
  return (
    <Link
      href="/mapa"
      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-4")}
    >
      Ver en el mapa
    </Link>
  );
}
