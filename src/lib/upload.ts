import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function validateImage(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Formato de imagen no permitido (usa JPG, PNG, WEBP o GIF).";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "La imagen supera el tamaño máximo de 5MB.";
  }
  return null;
}

function extensionFromType(type: string): string {
  switch (type) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

/**
 * Guarda un archivo de imagen.
 * - En producción (con VERCEL_BLOB_READ_WRITE_TOKEN) usa Vercel Blob.
 * - En desarrollo local guarda en public/uploads.
 */
export async function saveImage(file: File): Promise<string> {
  const error = validateImage(file);
  if (error) {
    throw new Error(error);
  }

  const name = `${Date.now()}-${randomUUID()}.${extensionFromType(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (process.env.VERCEL_BLOB_READ_WRITE_TOKEN) {
    const { url } = await put(`uploads/${name}`, buffer, {
      access: "public",
      contentType: file.type,
    });
    return url;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${name}`;
}
