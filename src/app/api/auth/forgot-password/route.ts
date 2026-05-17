import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok } from "@/lib/api";
import { findUserByEmail } from "@/lib/store";
import { getSupabaseAuthClient, isSupabaseConfigured } from "@/lib/supabase";

const schema = z.object({ email: z.email().transform((value) => value.toLowerCase()) });

export async function POST(request: NextRequest) {
  try {
    const input = schema.parse(await request.json());
    const user = await findUserByEmail(input.email);

    if (!user) {
      return fail("No account found for this email", 404);
    }

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAuthClient();
      if (!supabase) return fail("Supabase auth is not configured", 500);

      const { error } = await supabase.auth.resetPasswordForEmail(input.email);
      if (error) return fail(error.message, error.status ?? 400);

      return ok({
        delivery: "supabase-recovery-email",
        message: "Password recovery email sent by Supabase Auth.",
      });
    }

    return ok({
      delivery: "email",
      message: "OTP generated. Connect Resend, SES, or Firebase Auth email sender in production.",
      demoOtp: process.env.NODE_ENV === "production" ? undefined : "123456",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
