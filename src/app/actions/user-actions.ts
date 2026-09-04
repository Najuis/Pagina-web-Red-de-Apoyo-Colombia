"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";

export async function toggleUserActiveAction(
  userId: string,
  isActive: boolean
): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  await prisma.user.update({
    where: { id: userId },
    data: { isActive },
  });

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function deleteUserAction(userId: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN"]);
  if (!user) return { ok: false, error: "No autorizado: solo ADMIN puede eliminar usuarios" };

  if (user.id === userId) {
    return { ok: false, error: "No puedes eliminarte a ti mismo" };
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/usuarios");
  return { ok: true };
}