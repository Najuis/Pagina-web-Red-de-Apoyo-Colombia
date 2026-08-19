import pino from "pino";
import type { Logger } from "pino";

const redact = (obj: Record<string, unknown>): Record<string, unknown> => {
  const result = { ...obj };
  const redactList = ["password", "email", "creditCard", "ssn", "apiKey", "authToken", "twoFactorSecret"];
  for (const key of Object.keys(result)) {
    if (redactList.includes(key as string)) {
      (result as any)[key] = "***REDACTED***";
    }
    if (typeof (result as any)[key] === "object" && (result as any)[key] !== null) {
      (result as any)[key] = redact((result as any)[key] as Record<string, unknown>);
    }
  }
  return result;
};

const logger: Logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
});

export default logger;
export { redact };