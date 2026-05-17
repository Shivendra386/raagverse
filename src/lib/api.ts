import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { canAccess, getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  console.error(error);
  return fail("Unexpected server error", 500);
}

export async function requireRole(roles: UserRole[]) {
  const user = await getCurrentUser();
  if (!canAccess(user, roles)) {
    return { user: null, response: fail("Forbidden", 403) };
  }

  return { user, response: null };
}
