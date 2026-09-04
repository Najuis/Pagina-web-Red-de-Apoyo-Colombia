import { z } from "zod";
import {
  POST_CATEGORIES,
  POST_KINDS,
  POST_STATUSES,
  EVENT_TYPES,
  LOST_TYPES,
  LOST_STATUSES,
  ITEM_CATEGORIES,
  LOCATION_TYPES,
  CONTACT_TYPES,
} from "@/types";

export const slugSchema = z
  .string()
  .min(3, "El slug debe tener al menos 3 caracteres")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido (solo minúsculas, números y guiones)");

export const postSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  slug: slugSchema,
  content: z.string().min(20, "El contenido debe tener al menos 20 caracteres"),
  excerpt: z.string().max(300).optional().nullable(),
  image: z.string().url().optional().nullable(),
  kind: z.enum(POST_KINDS).default("PUBLICACION"),
  category: z.enum(POST_CATEGORIES).default("COMUNIDAD"),
  status: z.enum(POST_STATUSES).default("PUBLICADO"),
  featured: z.boolean().default(false),
});

export const postUpdateSchema = postSchema.partial();

export const eventSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres").max(200),
  description: z.string().max(1000).optional().nullable(),
  type: z.enum(EVENT_TYPES).default("EVENTO"),
  location: z.string().max(300).optional().nullable(),
  image: z.string().url().optional().nullable(),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional().nullable(),
});

export const lostReportSchema = z.object({
  type: z.enum(LOST_TYPES).default("PERSONA"),
  status: z.enum(LOST_STATUSES).default("PERDIDO"),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(150),
  description: z.string().min(10, "Describe con al menos 10 caracteres").max(2000),
  characteristics: z.string().max(500).optional().nullable(),
  lastLocation: z.string().min(3, "Indica la última ubicación").max(300),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  lostDate: z.coerce.date(),
  photo: z.string().url().optional().nullable(),
  contactType: z.enum(CONTACT_TYPES).default("WHATSAPP"),
  contactValue: z.string().min(5, "Indica un contacto válido").max(100),
});

export const itemSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(200),
  description: z.string().min(10, "Describe con al menos 10 caracteres").max(2000),
  category: z.enum(ITEM_CATEGORIES).default("OTROS"),
  image: z.string().url().optional().nullable(),
  price: z.coerce.number().min(0).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  contactType: z.enum(CONTACT_TYPES).default("WHATSAPP"),
  contactValue: z.string().min(5, "Indica un contacto válido").max(100),
});

export const mapLocationSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(200),
  type: z.enum(LOCATION_TYPES).default("OTRO"),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().max(300).optional().nullable(),
  hours: z.string().max(300).optional().nullable(),
  phone: z.string().max(100).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
});

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
  .regex(/[a-z]/, "Debe incluir al menos una letra minúscula")
  .regex(/[0-9]/, "Debe incluir al menos un número");

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre").max(100),
    email: z.string().email("Email inválido"),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type PostInput = z.infer<typeof postSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type LostReportInput = z.infer<typeof lostReportSchema>;
export type ItemInput = z.infer<typeof itemSchema>;
export type MapLocationInput = z.infer<typeof mapLocationSchema>;
