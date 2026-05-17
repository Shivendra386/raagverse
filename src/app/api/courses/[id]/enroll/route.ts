import { NextRequest } from "next/server";
import { fail, handleApiError, ok, requireRole } from "@/lib/api";
import { enrollStudentInCourse } from "@/lib/store";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole(["student", "admin"]);
    if (auth.response) return auth.response;

    const { id } = await params;
    const studentId = auth.user?.id;
    if (!studentId) return fail("Missing authenticated user", 401);

    const course = await enrollStudentInCourse(id, studentId);
    if (!course) return fail("Course not found", 404);

    return ok({ course });
  } catch (error) {
    return handleApiError(error);
  }
}
