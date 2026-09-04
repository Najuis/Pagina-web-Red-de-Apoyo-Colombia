"use client";

import { useState, useTransition } from "react";
import { Loader2, ShieldCheck, ShieldOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateTwoFactorSetupAction,
  showTwoFactorQrAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
} from "@/app/actions/auth-actions";

type Props = {
  initiallyEnabled: boolean;
};

export function TwoFactorSection({ initiallyEnabled }: Props) {
  const [enabled, setEnabled] = useState(initiallyEnabled);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [account, setAccount] = useState<string>("");
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();

  function startSetup() {
    setCode("");
    startTransition(async () => {
      const result = await generateTwoFactorSetupAction();
      if (!result.ok || !result.qrDataUrl) {
        toast.error(result.error ?? "No se pudo preparar 2FA");
        return;
      }
      setQrDataUrl(result.qrDataUrl);
      setAccount(result.account ?? "");
    });
  }

  function showQr() {
    setCode("");
    startTransition(async () => {
      const result = await showTwoFactorQrAction();
      if (!result.ok || !result.qrDataUrl) {
        toast.error(result.error ?? "No se pudo mostrar el código QR");
        return;
      }
      setQrDataUrl(result.qrDataUrl);
      setAccount(result.account ?? "");
    });
  }

  function confirmEnable() {
    startTransition(async () => {
      const result = await enableTwoFactorAction(code.trim());
      if (!result.ok) {
        toast.error(result.error ?? "No se pudo activar 2FA");
        return;
      }
      setEnabled(true);
      setQrDataUrl(null);
      setCode("");
      toast.success("Autenticación de dos factores activada");
    });
  }

  function confirmDisable() {
    startTransition(async () => {
      const result = await disableTwoFactorAction(code.trim());
      if (!result.ok) {
        toast.error(result.error ?? "No se pudo desactivar 2FA");
        return;
      }
      setEnabled(false);
      setCode("");
      toast.success("Autenticación de dos factores desactivada");
    });
  }

  if (enabled) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-success" aria-hidden="true" />
          <p className="text-sm font-medium">2FA activado</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Necesitarás tu app de autenticación (Google Authenticator, Authy…) al iniciar sesión.
        </p>
        {qrDataUrl ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Escanea este código con tu app de autenticación
              {account ? <span className="text-foreground"> (cuenta: {account})</span> : null}:
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt="Código QR para 2FA"
              className="mx-auto size-52 rounded-lg border"
            />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setQrDataUrl(null)}
              disabled={pending}
            >
              Ocultar código QR
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={showQr} disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Ver código QR
          </Button>
        )}
        <div className="flex items-end gap-2">
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="disable-code">Código actual</Label>
            <Input
              id="disable-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={confirmDisable} disabled={pending || code.length < 6}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Desactivar
          </Button>
        </div>
      </div>
    );
  }

  if (qrDataUrl) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Escanea este código con tu app de autenticación
          {account ? <span className="text-foreground"> (cuenta: {account})</span> : null}:
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt="Código QR para 2FA"
          className="mx-auto size-52 rounded-lg border"
        />
        <div className="flex items-end gap-2">
          <div className="grid flex-1 gap-1.5">
            <Label htmlFor="enable-code">Código de verificación</Label>
            <Input
              id="enable-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button onClick={confirmEnable} disabled={pending || code.length < 6}>
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            Confirmar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ShieldOff className="size-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium">2FA desactivado</p>
      </div>
      <p className="text-sm text-muted-foreground">
        Añade una capa extra de seguridad a tu cuenta: al iniciar sesión te pedirá además un
        código de tu app de autenticación.
      </p>
      <Button onClick={startSetup} disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
        Activar 2FA
      </Button>
    </div>
  );
}