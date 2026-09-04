"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
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
import { registerSchema } from "@/lib/validations";
import { registerAction } from "@/app/actions/auth-actions";

type RegisterValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [verificationLink, setVerificationLink] = useState<string | null>(null);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: RegisterValues) {
    setError(null);
    startTransition(async () => {
      const result = await registerAction(values);
      if (!result.ok) {
        setError(result.error ?? "No se pudo crear la cuenta");
        return;
      }

      if (result.verificationLink) {
        setVerificationLink(result.verificationLink);
        return;
      }

      await signIn("credentials", {
        email: result.email,
        password: values.password,
        redirect: false,
      });
      router.push("/");
      router.refresh();
    });
  }

  if (verificationLink) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <p className="font-medium">Cuenta creada. Verifica tu correo electrónico.</p>
          <p className="mt-1 text-muted-foreground">
            Hemos enviado un enlace de verificación a tu correo. Ábrelo para activar tu cuenta.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Si el correo no llega, usa este enlace (envío de correo aún no configurado):
          </p>
          <code className="mt-2 block break-all rounded bg-background px-3 py-2 text-xs">
            {verificationLink}
          </code>
        </div>
        <Button type="button" className="w-full" onClick={() => router.push("/login")}>
          Ir a iniciar sesión
        </Button>
      </div>
    );
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="tu@email.com" autoComplete="email" {...field} />
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
                <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={pending}>
          {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          Crear cuenta
        </Button>
      </form>
    </Form>
  );
}
