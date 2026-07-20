const COOKIE_NAME = "admin_auth";
const SESSION_DAYS = 7;

function getSecret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "dev-admin-secret";
}

async function hmacHex(message) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminToken() {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `admin:${expiresAt}`;
  const signature = await hmacHex(payload);
  return `${expiresAt}.${signature}`;
}

export async function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;

  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;

  const expiry = Number(expiresAt);
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false;

  const expected = await hmacHex(`admin:${expiresAt}`);
  if (expected.length !== signature.length) return false;

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }

  return mismatch === 0;
}

export function checkAdminPassword(password) {
  const expected = process.env.ADMIN_PASSWORD || "admin123";
  if (!password || password.length !== expected.length) {
    return password === expected;
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= password.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export function getAdminCookieName() {
  return COOKIE_NAME;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}
