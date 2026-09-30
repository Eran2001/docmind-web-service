// Pure helpers (no `document`), so the Next proxy (edge runtime) can use them too.

/** Expiry of a JWT in seconds since the epoch, or null if it isn't a readable JWT. The signature is NOT checked here; the API does that. */
export function jwtExpiry(token: string): number | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(payload.length / 4) * 4, "="));
    const exp = (JSON.parse(json) as { exp?: unknown }).exp;
    return typeof exp === "number" ? exp : null;
  } catch {
    return null;
  }
}

export function isExpired(token: string, skewSeconds = 5): boolean {
  const exp = jwtExpiry(token);
  return exp === null || exp * 1000 <= Date.now() + skewSeconds * 1000;
}
