type Entry = { count: number; resetAt: number; blockedUntil: number };
const buckets = new Map<string, Entry>();

/**
 * Best-effort process-local limiter for development and low-volume fallback.
 * Serverless instances do not share memory; use Upstash/Redis before public launch.
 */
export function rateLimit(key: string, options: { limit: number; windowMs: number; blockMs?: number }) {
  const now = Date.now();
  const current = buckets.get(key);
  const entry = !current || now >= current.resetAt
    ? { count: 0, resetAt: now + options.windowMs, blockedUntil: 0 }
    : current;
  if (entry.blockedUntil > now) return { allowed: false, remaining: 0, retryAfterMs: entry.blockedUntil - now };
  entry.count += 1;
  if (entry.count > options.limit) {
    entry.blockedUntil = now + (options.blockMs ?? options.windowMs);
    buckets.set(key, entry);
    return { allowed: false, remaining: 0, retryAfterMs: entry.blockedUntil - now };
  }
  buckets.set(key, entry);
  return { allowed: true, remaining: Math.max(0, options.limit - entry.count), retryAfterMs: 0 };
}