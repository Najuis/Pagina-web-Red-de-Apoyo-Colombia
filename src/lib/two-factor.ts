import { generateSecret as otpGenerateSecret, generateURI, verifySync } from "otplib";

export const TWO_FA_ISSUER = "Red de Apoyo Colombia";

export function generateSecret(): string {
  return otpGenerateSecret();
}

export function buildOtpauthUrl(account: string, secret: string): string {
  return generateURI({ issuer: TWO_FA_ISSUER, label: account, secret });
}

export function verifyTotp(token: string, secret: string): boolean {
  try {
    return verifySync({ secret, token: token.trim(), epochTolerance: [30, 30] }).valid;
  } catch {
    return false;
  }
}