import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const adminPaths = ["/admin"];
const userPaths = ["/perfil"];
const authPaths = ["/login", "/registro"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });
  const isAdminArea = adminPaths.some((p) => pathname.startsWith(p));
  const isUserArea = userPaths.some((p) => pathname.startsWith(p));
  const isAuthArea = authPaths.some((p) => pathname.startsWith(p));

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

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/perfil", "/login", "/registro"],
};
