"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
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

const ERROR_MESSAGES: Record<string, string> = {
  invalid_totp: "Código de verificación incorrecto. Inténtalo de nuevo.",
  too_many_attempts:
    "Demasiados intentos fallidos. Espera unos minutos e inténtalo de nuevo.",
  email_not_verified:
    "Primero verifica tu correo electrónico con el enlace que te enviamos.",
  CredentialsSignin: "Credenciales inválidas. Verifica tu email y contraseña.",
};

type LoginValues = {
  email: string;
  password: string;
  code: string;
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<"credentials" | "totp">("credentials");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema) as unknown as Resolver<LoginValues>,
    defaultValues: { email: "", password: "", code: "" },
  });

  function onSubmit(values: LoginValues) {
    setError(null);
    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        code: step === "totp" ? values.code.trim() : undefined,
        redirect: false,
      });

      if (result?.error) {
        if (step === "credentials" && result.error === "totp_required") {
          setStep("totp");
          return;
        }
        setError(ERROR_MESSAGES[result.error] ?? ERROR_MESSAGES.CredentialsSignin);
        return;
      }

      const callbackUrl = searchParams.get("callbackUrl") ?? "/";
      router.push(callbackUrl);
      router.refresh();
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

        {step === "totp" && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
            <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Tu cuenta usa doble factor. Introduce el código de 6 dígitos de tu app de
              autenticación.
            </span>
          </div>
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
                  disabled={step === "totp"}
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
                  disabled={step === "totp"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {step === "totp" && (
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
                    autoFocus
                    maxLength={6}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {step === "totp" ? "Verificar código" : "Iniciar sesión"}
        </Button>
      </form>
    </Form>
  );
}