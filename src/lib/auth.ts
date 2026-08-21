import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { decryptSecret } from "@/lib/crypto";
import { verifyTotp } from "@/lib/two-factor";
import { requireEmailVerification } from "@/lib/email";
import type { Role } from "@/types";
import logger from "@/lib/logger";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

class TwoFactorRequired extends CredentialsSignin {
  code = "totp_required";
}
class InvalidTotp extends CredentialsSignin {
  code = "invalid_totp";
}
class EmailNotVerified extends CredentialsSignin {
  code = "email_not_verified";
}
class AccountDisabled extends CredentialsSignin {
  code = "account_disabled";
}
class LoginRateLimited extends CredentialsSignin {
  code = "too_many_attempts";
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 6;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function attemptKey(ip: string, email: string): string {
  return `${ip}:${email}`;
}

function isRateLimited(key: string): boolean {
  const entry = loginAttempts.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(key: string): void {
  const now = Date.now();
  const entry = loginAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    logger.info({ key: "redacted" }, "Login attempt recorded (masked)");
    return;
  }
  entry.count += 1;
  logger.warn({ key: "redacted" }, "Login attempt count incremented (masked)");
}

function resetAttempts(key: string): void {
  loginAttempts.delete(key);
  logger.info({ key: "redacted" }, "Login attempts reset (masked)");
}

function requestIp(request?: Request): string {
  const forwarded = request?.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request?.headers.get("x-real-ip") ?? "unknown";
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Contraseña", type: "password" },
        code: { label: "Código 2FA", type: "text" },
      },
      authorize: async (credentials, request) => {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const email = parsed.data.email.trim().toLowerCase();
        const ip = requestIp(request);
        const key = attemptKey(ip, email);

        if (isRateLimited(key)) {
          throw new LoginRateLimited();
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.password) {
          recordFailure(key);
          return null;
        }

        const valid = await bcrypt.compare(parsed.data.password, user.password);
        if (!valid) {
          recordFailure(key);
          return null;
        }

        resetAttempts(key);

        if (!user.isActive) {
          throw new AccountDisabled();
        }

        if (requireEmailVerification() && !user.emailVerified) {
          throw new EmailNotVerified();
        }

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const code = typeof credentials?.code === "string" ? credentials.code.trim() : "";
          if (!code) {
            throw new TwoFactorRequired();
          }
          try {
            const secret = decryptSecret(user.twoFactorSecret);
            if (!verifyTotp(code, secret)) {
              throw new InvalidTotp();
            }
          } catch {
            throw new InvalidTotp();
          }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as Role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: Role }).role;
      }
      if (trigger === "update" && token) {
        // refresh desde el callback de sesión si hace falta
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) ?? "USER";
      }
      return session;
    },
  },
});