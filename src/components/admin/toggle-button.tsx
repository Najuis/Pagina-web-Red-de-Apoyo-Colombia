"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/app/actions/post-actions";

export function ToggleButton({
  action,
  id,
  active,
  activeLabel,
  inactiveLabel,
  successMessage = "Actualizado",
}: {
  action: (id: string) => Promise<ActionResult>;
  id: string;
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  successMessage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      const result = await action(id);
      if (!result.ok) {
        toast.error(result.error ?? "No se pudo actualizar");
        return;
      }
      toast.success(successMessage);
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      className={cn(active && "bg-success/10 text-success hover:bg-success/20")}
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : active ? (
        activeLabel
      ) : (
        inactiveLabel
      )}
    </Button>
  );
}
