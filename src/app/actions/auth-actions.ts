"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { requireRole, type ActionResult } from "@/app/actions/post-actions";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import { generateSecret, buildOtpauthUrl, verifyTotp } from "@/lib/two-factor";
import { buildVerificationLink, requireEmailVerification } from "@/lib/email";
import { auth } from "@/lib/auth";
import { toDataURL } from "qrcode";
import bcrypt from "bcryptjs";

export async function registerAction(input: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<ActionResult & { email?: string; verificationLink?: string }> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const email = parsed.data.email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Ya existe una cuenta con ese email" };
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  const emailVerificationToken = randomBytes(32).toString("hex");
  const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      password,
      role: "USER",
      emailVerificationToken,
      emailVerificationExpires,
    },
  });

  if (requireEmailVerification()) {
    return {
      ok: true,
      email,
      verificationLink: buildVerificationLink(emailVerificationToken),
    };
  }

  return { ok: true, email };
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token) return { ok: false, error: "Token inválido" };

  const user = await prisma.user.findUnique({ where: { emailVerificationToken: token } });
  if (!user) return { ok: false, error: "Enlace de verificación inválido" };

  if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
    return { ok: false, error: "El enlace de verificación ha expirado" };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function generateTwoFactorSetupAction(): Promise<
  ActionResult & { otpauthUrl?: string; qrDataUrl?: string; account?: string }
> {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { ok: false, error: "Inicia sesión para activar 2FA" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Usuario no encontrado" };
  if (user.twoFactorEnabled) return { ok: false, error: "2FA ya está activado" };

  const secret = generateSecret();
  const account = user.email;
  const otpauthUrl = buildOtpauthUrl(account, secret);
  const qrDataUrl = await toDataURL(otpauthUrl, { width: 220, margin: 1 });

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorSecret: encryptSecret(secret) },
  });

  return { ok: true, otpauthUrl, qrDataUrl, account };
}

export async function showTwoFactorQrAction(): Promise<
  ActionResult & { qrDataUrl?: string; account?: string }
> {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { ok: false, error: "Inicia sesión para ver el código QR" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { ok: false, error: "Usuario no encontrado" };
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    return { ok: false, error: "2FA no está activado" };
  }

  let secret: string;
  try {
    secret = decryptSecret(user.twoFactorSecret);
  } catch {
    return { ok: false, error: "No se pudo leer la configuración 2FA" };
  }

  const account = user.email;
  const otpauthUrl = buildOtpauthUrl(account, secret);
  const qrDataUrl = await toDataURL(otpauthUrl, { width: 220, margin: 1 });

  return { ok: true, qrDataUrl, account };
}

export async function getLoginQrAction(): Promise<
  ActionResult & { qrDataUrl?: string; account?: string }
> {
  const email = (process.env.LOGIN_QR_EMAIL ?? "admin@comunidad.local")
    .trim()
    .toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { ok: false, error: "Cuenta no encontrada para el código QR" };
  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    return { ok: false, error: "El 2FA no está activado para esa cuenta" };
  }

  let secret: string;
  try {
    secret = decryptSecret(user.twoFactorSecret);
  } catch {
    return { ok: false, error: "No se pudo leer la configuración 2FA" };
  }

  const account = user.email;
  const otpauthUrl = buildOtpauthUrl(account, secret);
  const qrDataUrl = await toDataURL(otpauthUrl, { width: 220, margin: 1 });

  return { ok: true, qrDataUrl, account };
}

export async function enableTwoFactorAction(code: string): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { ok: false, error: "Inicia sesión para activar 2FA" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorSecret) return { ok: false, error: "Primero genera el código QR" };

  let secret: string;
  try {
    secret = decryptSecret(user.twoFactorSecret);
  } catch {
    return { ok: false, error: "No se pudo leer la configuración 2FA" };
  }

  if (!verifyTotp(code.trim(), secret)) {
    return { ok: false, error: "Código incorrecto" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: true },
  });

  revalidatePath("/perfil", "layout");
  return { ok: true };
}

export async function disableTwoFactorAction(code: string): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id as string | undefined;
  if (!userId) return { ok: false, error: "Inicia sesión para desactivar 2FA" };

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return { ok: false, error: "2FA no está activado" };
  }

  let secret: string;
  try {
    secret = decryptSecret(user.twoFactorSecret);
  } catch {
    return { ok: false, error: "No se pudo leer la configuración 2FA" };
  }

  if (!verifyTotp(code.trim(), secret)) {
    return { ok: false, error: "Código incorrecto" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });

  revalidatePath("/perfil", "layout");
  return { ok: true };
}

export async function requireAdmin() {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) redirect("/login");
  return user;
}

export async function goLogin() {
  redirect("/login");
}