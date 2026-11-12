import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const cookieName = 'seoul-foods-admin';
const sessionSeconds = 8 * 60 * 60;

function adminPassword() {
  const value = process.env.SEOUL_ADMIN_PASSWORD;
  return value && value.length >= 24 ? value : null;
}

const digest = (value: string) => createHash('sha256').update(value).digest();
const sign = (password: string, expiry: string) => createHmac('sha256', password)
  .update('seoul-foods-admin-session:' + expiry).digest('base64url');

export function isAdminConfigured() {
  return Boolean(adminPassword());
}

export async function isAdminSignedIn() {
  const password = adminPassword();
  const token = (await cookies()).get(cookieName)?.value;
  if (!password || !token) return false;
  const [expiry, signature] = token.split('.');
  return Boolean(signature) && Number(expiry) > Date.now() &&
    timingSafeEqual(digest(signature), digest(sign(password, expiry)));
}

export async function signInAdmin(input: string) {
  const password = adminPassword();
  if (!password || input.length > 1024 || !timingSafeEqual(digest(input), digest(password))) return false;
  const expiry = String(Date.now() + sessionSeconds * 1000);
  (await cookies()).set(cookieName, expiry + '.' + sign(password, expiry), {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: sessionSeconds,
  });
  return true;
}

export async function signOutAdmin() {
  (await cookies()).delete(cookieName);
}
