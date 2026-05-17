import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok, requireRole } from "@/lib/api";
import { sanitizeUser } from "@/lib/auth";
import { updateTeacherApproval } from "@/lib/store";

const schema = z.object({
  approvalStatus: z.enum(["approved", "pending", "rejected"]),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole(["admin"]);
    if (auth.response) return auth.response;

    const { id } = await params;
    const input = schema.parse(await request.json());
    const teacher = await updateTeacherApproval(id, input.approvalStatus);

    if (!teacher) return fail("Teacher not found", 404);
    return ok({ user: sanitizeUser(teacher) });
  } catch (error) {
    return handleApiError(error);
  }
}
