"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/layout/section-header";
import { verifyEmailAction } from "@/app/actions/auth-actions";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Verificando…
            </CardContent>
          </Card>
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";

  const [result, setResult] = useState<
    { status: "pending" | "ok" | "error"; message: string }
  >(() =>
    token
      ? { status: "pending", message: "" }
      : { status: "error", message: "Enlace de verificación inválido" }
  );

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      const r = await verifyEmailAction(token);
      if (cancelled) return;
      setResult(
        r.ok
          ? { status: "ok", message: "Tu correo ha sido verificado correctamente." }
          : { status: "error", message: r.error ?? "No se pudo verificar el correo" }
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <SectionHeader title="Verificación de correo" subtitle="Confirmación de tu cuenta" />
      <Card>
        <CardContent className="p-8 text-center">
          {result.status === "pending" && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              <span className="text-sm">Verificando tu correo…</span>
            </div>
          )}

          {result.status === "ok" && (
            <div className="space-y-4">
              <CheckCircle2 className="mx-auto size-10 text-success" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">{result.message}</p>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Ir a iniciar sesión
              </Button>
            </div>
          )}

          {result.status === "error" && (
            <div className="space-y-4">
              <XCircle className="mx-auto size-10 text-destructive" aria-hidden="true" />
              <p className="text-sm text-destructive">{result.message}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login">Ir a iniciar sesión</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}