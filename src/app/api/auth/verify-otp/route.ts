import { NextRequest } from "next/server";
import { z } from "zod";
import { createSessionToken, sanitizeUser, setAuthCookie } from "@/lib/auth";
import { handleApiError, ok, fail } from "@/lib/api";
import { deleteSignupIntent, findSignupIntentByEmail, findUserByEmail, upsertUser } from "@/lib/store";
import { getSupabaseAuthClient, isSupabaseConfigured } from "@/lib/supabase";
import type { User } from "@/lib/types";

const schema = z.object({
  email: z.email(),
  otp: z.string().length(6),
  purpose: z.enum(["email-verification", "password-reset"]),
});

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAuthClient();
      if (!supabase) return fail("Supabase auth is not configured", 500);

      const { data, error } = await supabase.auth.verifyOtp({
        email: input.email,
        token: input.otp,
        type: input.purpose === "password-reset" ? "recovery" : "email",
      });

      if (error) return fail(error.message, error.status ?? 401);
      if (!data.user) return fail("OTP verified but no Supabase user was returned", 500);

      const existing = await findUserByEmail(input.email);
      const signupIntent = await findSignupIntentByEmail(input.email);
      const role = existing?.role ?? signupIntent?.role ?? "student";
      const approvalStatus: User["approvalStatus"] =
        existing?.approvalStatus ?? signupIntent?.approvalStatus ?? (role === "teacher" ? "pending" : "approved");

      const user = await upsertUser({
        id: data.user.id,
        name: existing?.name ?? signupIntent?.name ?? input.email.split("@")[0],
        email: input.email.toLowerCase(),
        role,
        passwordHash: "",
        verified: true,
        approvalStatus,
        age: existing?.age ?? signupIntent?.age,
        instrument: existing?.instrument ?? signupIntent?.instrument,
        level: existing?.level ?? signupIntent?.level,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      });

      await deleteSignupIntent(input.email);

      const token = await createSessionToken(user);
      await setAuthCookie(token);

      return ok({
        user: sanitizeUser(user),
        tokenType: "httpOnly-cookie",
        supabaseSession: Boolean(data.session),
      });
    }

    if (process.env.NODE_ENV === "production") {
      return fail("OTP verification requires Supabase Auth in production", 501);
    }

    if (input.otp !== "123456") {
      return fail("Invalid OTP", 401);
    }

    const existing = await findUserByEmail(input.email);
    if (!existing) return fail("No account found for this email", 404);

    const user = await upsertUser({
      ...existing,
      verified: true,
    });
    const token = await createSessionToken(user);
    await setAuthCookie(token);

    return ok({
      user: sanitizeUser(user),
      tokenType: "httpOnly-cookie",
      purpose: input.purpose,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
