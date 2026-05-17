import bcrypt from "bcryptjs";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { findUserById } from "@/lib/store";
import type { User, UserRole } from "@/lib/types";

const cookieName = "raagverse_token";

function jwtSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "dev-only-change-me-before-deploying-raagverse");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (passwordHash.startsWith("demo:")) {
    return passwordHash === `demo:${password}`;
  }

  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(user: Pick<User, "id" | "email" | "role">) {
  return new SignJWT({ email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(jwtSecret());
}

export async function verifySessionToken(token: string) {
  const payload = await jwtVerify(token, jwtSecret());
  return {
    userId: payload.payload.sub as string,
    email: payload.payload.email as string,
    role: payload.payload.role as UserRole,
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;
  if (!token) return null;

  try {
    const session = await verifySessionToken(token);
    return findUserById(session.userId);
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function sanitizeUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
    approvalStatus: user.approvalStatus,
    age: user.age,
    instrument: user.instrument,
    level: user.level,
    createdAt: user.createdAt,
  };
}

export function canAccess(user: User | null, roles: UserRole[]) {
  return Boolean(user && user.verified && user.approvalStatus === "approved" && roles.includes(user.role));
}
