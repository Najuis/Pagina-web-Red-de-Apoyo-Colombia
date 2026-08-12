"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";
import bcrypt from "bcryptjs";

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult & { email?: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { ok: false, error: "Ya existe una cuenta con ese email" };
  }

  const password = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: "USER",
    },
  });

  return { ok: true, email: parsed.data.email };
}

export async function requireAdmin() {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) redirect("/login");
  return user;
}

export async function goLogin() {
  redirect("/login");
}
