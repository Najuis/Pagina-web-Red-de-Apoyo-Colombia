import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Compass className="size-12 text-primary" aria-hidden="true" />
      <h1 className="font-heading mt-4 text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-muted-foreground">
        La página que buscas no existe o fue movida.
      </p>
      <Button asChild className="mt-6">
        <Link href="/">Volver al inicio</Link>
      </Button>
    </div>
  );
}
