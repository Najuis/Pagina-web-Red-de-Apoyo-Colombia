export const siteConfig = {
  name: "Red de Apoyo Colombia",
  shortName: "Apoyo Colombia",
  description:
    "Plataforma de apoyo ante desastres naturales en Colombia: alertas, personas y animales perdidos, centros de acopio, albergues y red de voluntarios e insumos.",
  locale: "es",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://apoyocolombia.online",
  ogImage: "/images/og-default.jpg",
  contact: {
    email: "apoyo.colombia26@gmail.com",
    address: "Bogotá, Colombia",
    hours: "Atención 24/7 durante emergencias",
  },
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
    whatsapp: "https://wa.me/573000000000",
    x: "https://x.com/",
  },
  googleNews: {
    queries: [
      "terremoto Eje Cafetero",
      "emergencia terremoto Cauca Colombia",
      "ayuda humanitaria Colombia",
      "sismo Colombia",
    ],
    language: "es-419",
    region: "CO",
    resultLimit: 8,
  },
  map: {
    center: { lat: 4.5, lng: -76.0 },
    zoom: 8,
    tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/noticias", label: "Noticias" },
    { href: "/avisos", label: "Avisos" },
    { href: "/perdidos", label: "Perdidos" },
    { href: "/insumos", label: "Insumos y Ayuda" },
    { href: "/mapa", label: "Mapa" },
    { href: "/publicaciones", label: "Publicaciones" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
