"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";

export async function createEvent(input: {
  title: string;
  description?: string | null;
  type?: string;
  location?: string | null;
  image?: string | null;
  startAt: Date | string;
  endAt?: Date | string | null;
}): Promise<ActionResult & { id?: string }> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const event = await prisma.event.create({ data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true, id: event.id };
}

export async function updateEvent(
  id: string,
  input: Parameters<typeof createEvent>[0]
): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Aviso no encontrado" };

  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.event.update({ where: { id }, data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  await prisma.event.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
