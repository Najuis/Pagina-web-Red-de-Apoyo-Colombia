import { siteConfig } from "@/lib/site.config";

export function buildVerificationLink(token: string): string {
  return `${siteConfig.url}/verificar-email?token=${token}`;
}

export function requireEmailVerification(): boolean {
  return process.env.REQUIRE_EMAIL_VERIFICATION === "true";
}