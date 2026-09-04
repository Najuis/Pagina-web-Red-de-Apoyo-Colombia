import type { ContactType } from "@/types";

export function contactHref(type: ContactType | string, value: string): string {
  switch (type) {
    case "WHATSAPP":
      return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
    case "TELEFONO":
      return `tel:${value.replace(/[^+0-9]/g, "")}`;
    case "EMAIL":
      return `mailto:${value}`;
    default:
      return "#";
  }
}

export function formatContactValue(type: ContactType | string, value: string): string {
  switch (type) {
    case "WHATSAPP":
      return value.replace(/^\+/, "");
    case "TELEFONO":
      return value;
    case "EMAIL":
      return value;
    default:
      return value;
  }
}
