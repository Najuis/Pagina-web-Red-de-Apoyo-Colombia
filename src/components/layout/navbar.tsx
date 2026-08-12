import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/site.config";
import { NavClient } from "@/components/layout/nav-client";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartHandshake className="size-5" aria-hidden="true" />
          </span>
          <span className="font-heading text-lg font-bold leading-tight">
            {siteConfig.name}
          </span>
        </Link>

        <NavClient
          navItems={siteConfig.nav}
          user={
            session?.user
              ? {
                  name: session.user.name ?? "Usuario",
                  email: session.user.email ?? "",
                  image: session.user.image ?? null,
                  role: session.user.role,
                }
              : null
          }
        />
      </div>
    </header>
  );
}
