"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapLocationSchema } from "@/lib/validations";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";

export async function createLocation(input: {
  name: string;
  type?: string;
  latitude: number | string;
  longitude: number | string;
  address?: string | null;
  hours?: string | null;
  phone?: string | null;
  description?: string | null;
}): Promise<ActionResult & { id?: string }> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const parsed = mapLocationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const location = await prisma.mapLocation.create({ data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true, id: location.id };
}

export async function updateLocation(
  id: string,
  input: Parameters<typeof createLocation>[0]
): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const existing = await prisma.mapLocation.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Ubicación no encontrada" };

  const parsed = mapLocationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.mapLocation.update({ where: { id }, data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteLocation(id: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  await prisma.mapLocation.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}
