import { createHash } from "node:crypto";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const entries = new Map<string, RateLimitEntry>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

export function checkDevelopmentRateLimit(
  remoteAddress: string | undefined,
  now = Date.now(),
): boolean {
  if (process.env.NODE_ENV !== "development") {
    return true;
  }

  const key = createHash("sha256")
    .update(remoteAddress || "unknown")
    .digest("hex")
    .slice(0, 16);
  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) {
    return false;
  }

  current.count += 1;
  return true;
}

export function resetDevelopmentRateLimitForTests(): void {
  entries.clear();
}
