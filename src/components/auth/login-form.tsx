"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/lib/validations";
import { getLoginQrAction } from "@/app/actions/auth-actions";

const loginSchemaWithCode = loginSchema.extend({
  code: z.string().optional(),
});

const ERROR_MESSAGES: Record<string, string> = {
  totp_required:
    "Tu cuenta tiene activado el doble factor. Ingresa el código de 6 dígitos de tu app de autenticación en la sección de abajo.",
  invalid_totp:
    "Código de verificación incorrecto. Revisa el código actual en tu app de autenticación.",
  too_many_attempts:
    "Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.",
  email_not_verified:
    "Primero verifica tu correo electrónico con el enlace que te enviamos.",
  account_disabled:
    "Tu cuenta está desactivada. Contacta al administrador para restablecer el acceso.",
  CredentialsSignin: "Credenciales inválidas. Verifica tu email y contraseña.",
};

type LoginValues = {
  email: string;
  password: string;
  code?: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrAccount, setQrAccount] = useState<string>("");
  const [qrError, setQrError] = useState<string | null>(null);
  const [loadingQr, startQrTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchemaWithCode) as unknown as Resolver<LoginValues>,
    defaultValues: { email: "", password: "", code: "" },
  });

  function loadQr() {
    setQrError(null);
    startQrTransition(async () => {
      const result = await getLoginQrAction();
      if (!result.ok || !result.qrDataUrl) {
        setQrError(result.error ?? "No se pudo mostrar el código QR");
        return;
      }
      setQrDataUrl(result.qrDataUrl);
      setQrAccount(result.account ?? "");
    });
  }

  function onSubmit(values: LoginValues) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        code: values.code?.trim() || undefined,
        redirect: false,
      });

      if (result?.error) {
        setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.CredentialsSignin);
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") ?? "/";
      router.push(callbackUrl);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Iniciar sesión
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-wider">
            <span className="bg-background px-2 text-muted-foreground">o</span>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <ShieldCheck className="size-4 shrink-0 text-primary" aria-hidden="true" />
            Iniciar sesión con Google Authenticator
          </div>
          <p className="text-xs text-muted-foreground">
            Si tu cuenta tiene el doble factor activado, ingresa aquí el código de 6
            dígitos de tu app de autenticación.
          </p>

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código de verificación</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" variant="outline" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Iniciar sesión con el autenticador
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <p className="text-xs text-muted-foreground">
            ¿Aún no tienes el autenticador configurado? Escanea el código QR con Google
            Authenticator para agregar la cuenta.
          </p>
          {qrDataUrl ? (
            <div className="space-y-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Código QR del autenticador"
                className="mx-auto size-52 rounded-lg border"
              />
              {qrAccount && (
                <p className="text-center text-xs text-muted-foreground">Cuenta: {qrAccount}</p>
              )}
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setQrDataUrl(null)}
              >
                Ocultar código QR
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={loadQr}
              disabled={loadingQr}
            >
              {loadingQr && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Mostrar código QR
            </Button>
          )}
          {qrError && <p className="text-xs text-destructive">{qrError}</p>}
          <p className="text-xs text-warning">
            Este QR permite acceder a la cuenta. Compártelo solo con personas de confianza.
          </p>
        </div>
      </form>
    </Form>
  );
}