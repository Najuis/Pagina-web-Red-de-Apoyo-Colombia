"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleUserActiveAction } from "@/app/actions/user-actions";

type Props = {
  userId: string;
  isActive: boolean;
};

export function UserActiveToggle({ userId, isActive }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await toggleUserActiveAction(userId, !isActive);
      if (!result.ok) {
        toast.error(result.error ?? "No se pudo actualizar el estado");
        return;
      }
      toast.success(isActive ? "Usuario desactivado" : "Usuario activado");
      router.refresh();
    });
  }

  return (
    <Button
      size="sm"
      variant={isActive ? "destructive" : "default"}
      onClick={toggle}
      disabled={pending}
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {isActive ? "Desactivar" : "Activar"}
    </Button>
  );
}