import { NextRequest } from "next/server";
import { createSessionToken, hashPassword, sanitizeUser, setAuthCookie } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";
import { createUser, findUserByEmail, saveSignupIntent } from "@/lib/store";
import { getSupabaseAuthClient, isSupabaseConfigured } from "@/lib/supabase";
import { signupSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const input = signupSchema.parse(await request.json());
    const existingUser = await findUserByEmail(input.email);

    if (existingUser) {
      return fail("An account with this email already exists", 409);
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAuthClient();
      if (!supabase) return fail("Supabase auth is not configured", 500);

      await saveSignupIntent({
        name: input.name,
        email: input.email,
        role: input.role,
        approvalStatus: input.role === "teacher" ? "pending" : "approved",
        age: input.age,
        instrument: input.instrument,
        level: input.level,
      });

      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) return fail(error.message, error.status ?? 400);

      return ok({
        delivery: "supabase-email-otp",
        email: input.email,
        nextStep: input.role === "teacher" ? "verify_email_then_await_admin_approval" : "verify_email_otp",
      });
    }

    if (!input.password) {
      return fail("Password is required when Supabase OTP is not configured", 422);
    }

    const user = await createUser({
      name: input.name,
      email: input.email,
      role: input.role,
      passwordHash: await hashPassword(input.password),
      verified: true,
      approvalStatus: input.role === "teacher" ? "pending" : "approved",
      age: input.age,
      instrument: input.instrument,
      level: input.level,
    });

    const token = await createSessionToken(user);
    await setAuthCookie(token);

    return ok({
      user: sanitizeUser(user),
      nextStep: input.role === "teacher" ? "await_admin_approval" : "dashboard",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
