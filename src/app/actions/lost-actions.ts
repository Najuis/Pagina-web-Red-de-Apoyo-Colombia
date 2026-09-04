"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { lostReportSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import type { ActionResult } from "@/app/actions/post-actions";

export async function createLostReport(input: {
  type?: string;
  status?: string;
  name: string;
  description: string;
  characteristics?: string | null;
  lastLocation: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  lostDate: Date | string;
  photo?: string | null;
  contactType?: string;
  contactValue: string;
}): Promise<ActionResult & { id?: string }> {
  const session = await auth();
  if (!session?.user) return { ok: false, error: "Inicia sesión para reportar" };

  const parsed = lostReportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const report = await prisma.lostReport.create({
    data: {
      ...parsed.data,
      reporterId: session.user.id as string,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true, id: report.id };
}

export async function canManageLostReport(reportId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user) return false;
  const userId = session.user.id as string;
  if (session.user.role === "ADMIN" || session.user.role === "EDITOR") return true;

  const report = await prisma.lostReport.findUnique({ where: { id: reportId } });
  return report?.reporterId === userId;
}

export async function updateLostReport(
  id: string,
  input: Parameters<typeof createLostReport>[0]
): Promise<ActionResult> {
  if (!(await canManageLostReport(id))) return { ok: false, error: "No autorizado" };

  const existing = await prisma.lostReport.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Reporte no encontrado" };

  const parsed = lostReportSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.lostReport.update({ where: { id }, data: parsed.data });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteLostReport(id: string): Promise<ActionResult> {
  if (!(await canManageLostReport(id))) return { ok: false, error: "No autorizado" };

  await prisma.lostReport.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function markFound(id: string): Promise<ActionResult> {
  if (!(await canManageLostReport(id))) return { ok: false, error: "No autorizado" };

  const existing = await prisma.lostReport.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Reporte no encontrado" };

  await prisma.lostReport.update({
    where: { id },
    data: { status: existing.status === "ENCONTRADO" ? "PERDIDO" : "ENCONTRADO" },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
