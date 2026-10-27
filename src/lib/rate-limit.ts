import "server-only";

/**
 * Small in-memory, fixed-window rate limiter keyed by client IP.
 * It protects the owner's AI API key from abuse. IPs are kept in memory
 * only for the duration of the window (60s) and are never written to disk.
 *
 * For multi-instance deployments swap this for a shared store (e.g. Redis).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;

const globalForRateLimit = globalThis as typeof globalThis & {
  __hushRateLimitBuckets?: Map<string, Bucket>;
};

const buckets = globalForRateLimit.__hushRateLimitBuckets ?? new Map<string, Bucket>();
globalForRateLimit.__hushRateLimitBuckets = buckets;

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map never grows unbounded.
  if (buckets.size > 5000) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
