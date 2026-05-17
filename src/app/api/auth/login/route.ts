import { NextRequest } from "next/server";
import { createSessionToken, sanitizeUser, setAuthCookie, verifyPassword } from "@/lib/auth";
import { fail, handleApiError, ok } from "@/lib/api";
import { findUserByEmail } from "@/lib/store";
import { getSupabaseAuthClient, isSupabaseConfigured } from "@/lib/supabase";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const input = loginSchema.parse(await request.json());

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAuthClient();
      if (!supabase) return fail("Supabase auth is not configured", 500);

      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) return fail(error.message, error.status ?? 400);

      return ok({
        delivery: "supabase-email-otp",
        email: input.email,
        nextStep: "verify_email_otp",
      });
    }

    if (!input.password) {
      return fail("Password is required when Supabase OTP is not configured", 422);
    }

    const user = await findUserByEmail(input.email);

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      return fail("Invalid email or password", 401);
    }

    if (user.role === "teacher" && user.approvalStatus !== "approved") {
      return fail("Teacher account is waiting for admin approval", 403);
    }

    const token = await createSessionToken(user);
    await setAuthCookie(token);

    return ok({ user: sanitizeUser(user), tokenType: "httpOnly-cookie" });
  } catch (error) {
    return handleApiError(error);
  }
}
