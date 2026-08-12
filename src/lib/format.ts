import { format, formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export function formatDate(date: Date | string, pattern = "d 'de' MMMM, yyyy"): string {
  return format(new Date(date), pattern, { locale: es });
}

export function formatDateTime(
  date: Date | string,
  pattern = "d 'de' MMMM, yyyy - HH:mm"
): string {
  return format(new Date(date), pattern, { locale: es });
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });
}

export function toDateTimeLocal(date: Date | string): string {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function money(value: number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(value);
}
