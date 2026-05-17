import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok, requireRole } from "@/lib/api";
import { createCheckoutSession } from "@/lib/payments";
import { findCourseById, saveCheckoutSession } from "@/lib/store";

const schema = z.object({
  courseId: z.string().min(3),
  provider: z.enum(["razorpay", "stripe"]).default("razorpay"),
  currency: z.enum(["INR", "USD"]).default("INR"),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(["student", "admin"]);
    if (auth.response) return auth.response;

    const input = schema.parse(await request.json());
    const course = await findCourseById(input.courseId);
    if (!course) return fail("Course not found", 404);

    const checkout = await createCheckoutSession({
      provider: input.provider,
      currency: input.currency,
      course,
      origin: request.nextUrl.origin,
      buyerEmail: auth.user?.email,
    });

    if (auth.user) {
      await saveCheckoutSession(auth.user.id, checkout);
    }

    return ok(checkout);
  } catch (error) {
    return handleApiError(error);
  }
}
