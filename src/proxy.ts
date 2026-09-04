import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminPaths = ["/admin"];
const userPaths = ["/perfil"];
const authPaths = ["/login", "/registro"];

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "https://apoyocolombia.online"];

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Allow requests without origin (e.g., curl, mobile apps)
  return allowedOrigins.includes(origin);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");
  
  // CORS headers
  const response = NextResponse.next();
  const allowedOrigin = isOriginAllowed(origin) ? origin || "*" : "";
  if (allowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "86400");

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
    return response;
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isAdminArea = adminPaths.some((p) => pathname.startsWith(p));
  const isUserArea = userPaths.some((p) => pathname.startsWith(p));
  const isAuthArea = authPaths.some((p) => pathname.startsWith(p));

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (isAdminArea) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    const role = token.role;
    if (role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isUserArea && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthArea && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/perfil", "/login", "/registro"],
};
