// Lightweight in-memory rate limiter for public form submissions.
//
// Fluid Compute reuses warm function instances, so this in-memory map
// persists across most consecutive requests from the same visitor and is a
// reasonable free-tier deterrent. It is best-effort, not distributed — for
// stricter guarantees across many cold instances, pair this with a Marketplace
// Redis (e.g. Upstash) rate limiter.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

// Periodically drop stale buckets so this map can't grow unbounded.
function sweep(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  retryAfterSeconds?: number;
} {
  const now = Date.now();
  if (buckets.size > 5000) sweep(now);

  const existing = buckets.get(identifier);

  if (!existing || existing.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (existing.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  existing.count += 1;
  return { allowed: true };
}
