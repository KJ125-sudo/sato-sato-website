/** Shared auth helpers for Inside brand-bible gate (Edge + Node). */

export const COOKIE_NAME = 'sato_inside_auth';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getBrandPassword() {
  return process.env.BRAND_PASSWORD || '';
}

export function getAuthSecret() {
  return process.env.BRAND_AUTH_SECRET || 'sato-inside-default-secret';
}

export async function createSessionToken(password = getBrandPassword()) {
  const secret = getAuthSecret();
  const payload = `${password}:${secret}`;
  const data = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function isValidSessionToken(token) {
  if (!token || !getBrandPassword()) return false;
  const expected = await createSessionToken();
  return timingSafeEqual(token, expected);
}

function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    out[key] = decodeURIComponent(value);
  }
  return out;
}

export function buildAuthCookie(token, { secure = true } = {}) {
  const parts = [
    `${COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${COOKIE_MAX_AGE}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  return parts.join('; ');
}

export function isInsidePath(pathname) {
  return pathname === '/Inside' || pathname.startsWith('/Inside/');
}

export function isInsidePublicPath(pathname) {
  return (
    pathname === '/Inside/login' ||
    pathname === '/Inside/login.html' ||
    pathname === '/api/inside-login'
  );
}

/** Static assets under /Inside that must not be rewritten to login (e.g. audio for <audio> elements). */
export function isInsideStaticAsset(pathname) {
  return pathname.startsWith('/Inside/audio/');
}
