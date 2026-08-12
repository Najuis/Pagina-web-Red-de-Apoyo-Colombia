import type { User, Post, Event, LostReport, Item, MapLocation } from "@prisma/client";

export type Role = User["role"];
export type { User, Post, Event, LostReport, Item, MapLocation };

export const ROLES = ["ADMIN", "EDITOR", "USER"] as const;

export const POST_KINDS = ["PUBLICACION", "NOTICIA"] as const;
export type PostKind = (typeof POST_KINDS)[number];

export const POST_STATUSES = ["PUBLICADO", "BORRADOR"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const POST_CATEGORIES = [
  "EMERGENCIA",
  "ALERTAS",
  "AYUDA",
  "DONACIONES",
  "VOLUNTARIADO",
  "COMUNIDAD",
  "OTROS",
] as const;
export type PostCategory = (typeof POST_CATEGORIES)[number];

export const EVENT_TYPES = [
  "VOLUNTARIADO",
  "DONACION",
  "RESCATE",
  "CAPACITACION",
  "ALBERGUE",
  "EVENTO",
  "ACTIVIDAD",
] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const LOST_TYPES = ["PERSONA", "ANIMAL"] as const;
export type LostType = (typeof LOST_TYPES)[number];

export const LOST_STATUSES = ["PERDIDO", "ENCONTRADO", "BUSQUEDA_ACTIVA"] as const;
export type LostStatus = (typeof LOST_STATUSES)[number];

export const ITEM_CATEGORIES = [
  "ALIMENTOS",
  "AGUA",
  "ROPA",
  "MEDICAMENTOS",
  "ALOJAMIENTO",
  "TRANSPORTE",
  "SERVICIOS",
  "VOLUNTARIADO",
  "OTROS",
] as const;
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

export const LOCATION_TYPES = [
  "CENTRO_ACOPIO",
  "ALBERGUE",
  "CENTRO_SALUD",
  "PUNTO_ENCUENTRO",
  "PUNTO_INFORMACION",
  "OTRO",
] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];

export type ContactInfo = {
  type: "WHATSAPP" | "TELEFONO" | "EMAIL";
  value: string;
};

export const CONTACT_TYPES = ["WHATSAPP", "TELEFONO", "EMAIL"] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export const POST_KIND_LABELS: Record<PostKind, string> = {
  PUBLICACION: "Publicación",
  NOTICIA: "Noticia",
};

export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  PUBLICADO: "Publicado",
  BORRADOR: "Borrador",
};

export const POST_CATEGORY_LABELS: Record<PostCategory, string> = {
  EMERGENCIA: "Emergencia",
  ALERTAS: "Alertas",
  AYUDA: "Ayuda",
  DONACIONES: "Donaciones",
  VOLUNTARIADO: "Voluntariado",
  COMUNIDAD: "Comunidad",
  OTROS: "Otros",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  VOLUNTARIADO: "Voluntariado",
  DONACION: "Donación",
  RESCATE: "Rescate",
  CAPACITACION: "Capacitación",
  ALBERGUE: "Albergue",
  EVENTO: "Evento",
  ACTIVIDAD: "Actividad",
};

export const LOST_TYPE_LABELS: Record<LostType, string> = {
  PERSONA: "Persona",
  ANIMAL: "Animal",
};

export const LOST_STATUS_LABELS: Record<LostStatus, string> = {
  PERDIDO: "Perdido",
  ENCONTRADO: "Encontrado",
  BUSQUEDA_ACTIVA: "Búsqueda activa",
};

export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  ALIMENTOS: "Alimentos",
  AGUA: "Agua",
  ROPA: "Ropa",
  MEDICAMENTOS: "Medicamentos",
  ALOJAMIENTO: "Alojamiento",
  TRANSPORTE: "Transporte",
  SERVICIOS: "Servicios",
  VOLUNTARIADO: "Voluntariado",
  OTROS: "Otros",
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
  CENTRO_ACOPIO: "Centro de acopio",
  ALBERGUE: "Albergue",
  CENTRO_SALUD: "Centro de salud",
  PUNTO_ENCUENTRO: "Punto de encuentro",
  PUNTO_INFORMACION: "Punto de información",
  OTRO: "Otro",
};

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  WHATSAPP: "WhatsApp",
  TELEFONO: "Teléfono",
  EMAIL: "Email",
};
