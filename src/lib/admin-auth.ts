import { SignJWT, jwtVerify } from "jose";

const ADMIN_SESSION_COOKIE = "nayaab_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a random 32+ character value in your environment."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: string;
}

export async function createAdminSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminSessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.adminId || !payload.email || !payload.role) return null;
    return { adminId: payload.adminId as string, email: payload.email as string, role: payload.role as string };
  } catch {
    return null;
  }
}

export { ADMIN_SESSION_COOKIE, SESSION_DURATION_SECONDS };
