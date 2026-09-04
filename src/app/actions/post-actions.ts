"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postSchema, postUpdateSchema, slugSchema } from "@/lib/validations";
import { slugify } from "@/lib/format";
import type { Role } from "@/types";

export type ActionResult = { ok: boolean; error?: string };

export async function requireRole(roles: Role[]): Promise<NonNullable<Session["user"]> | null> {
  const session = await auth();
  if (!session?.user || !roles.includes(session.user.role)) {
    return null;
  }
  return session.user;
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const raw = base || "publicacion";
  const slug = slugify(raw);
  let candidate = slug;
  let n = 2;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) break;
    candidate = `${slug}-${n++}`;
  }
  return candidate;
}

export async function createPost(input: {
  title: string;
  content: string;
  excerpt?: string | null;
  image?: string | null;
  kind?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  slug?: string;
}): Promise<ActionResult & { id?: string }> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const parsed = postSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = await uniqueSlug(parsed.data.slug ?? slugify(parsed.data.title));
  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      slug,
      authorId: user.id as string,
    },
  });

  revalidatePath("/", "layout");
  return { ok: true, id: post.id };
}

export async function updatePost(
  id: string,
  input: Parameters<typeof createPost>[0]
): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Publicación no encontrada" };

  const parsed = postUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const slug = parsed.data.slug ? await uniqueSlug(parsed.data.slug, id) : existing.slug;

  await prisma.post.update({
    where: { id },
    data: { ...parsed.data, slug },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deletePost(id: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  await prisma.post.delete({ where: { id } });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleFeatured(id: string): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "EDITOR"]);
  if (!user) return { ok: false, error: "No autorizado" };

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { ok: false, error: "Publicación no encontrada" };

  await prisma.post.update({
    where: { id },
    data: { featured: !post.featured },
  });

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function validateSlug(slug: string): Promise<{ available: boolean }> {
  const parsed = slugSchema.safeParse(slug);
  if (!parsed.success) return { available: false };
  const existing = await prisma.post.findUnique({ where: { slug: parsed.data } });
  return { available: !existing };
}

export async function goAdmin() {
  redirect("/admin");
}
