"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { itemSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";

export async function createItem(input: {
  name: string;
  description: string;
  category?: string;
  image?: string | null;
  price?: number | string | null;
  location?: string | null;
  contactType?: string;
  contactValue: string;
}): Promise<ActionResult & { id?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Inicia sesión para publicar" };

  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const item = await prisma.item.create({
    data: {
      ...parsed.data,
      publishedById: session.user.id as string,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true, id: item.id };
}

export async function updateItem(
  id: string,
  input: Parameters<typeof createItem>[0]
): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const existing = await prisma.item.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Insumo no encontrado" };

  const parsed = itemSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.item.update({ where: { id }, data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteItem(id: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  await prisma.item.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
