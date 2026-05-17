import { NextRequest } from "next/server";
import { handleApiError, ok, requireRole } from "@/lib/api";
import { createCourse, listCourses } from "@/lib/store";
import { courseSchema } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const courses = await listCourses({
    search: params.get("search") ?? undefined,
    level: params.get("level") ?? undefined,
    instrument: params.get("instrument") ?? undefined,
  });

  return ok(courses);
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(["teacher", "admin"]);
    if (auth.response) return auth.response;

    const input = courseSchema.parse(await request.json());
    const course = await createCourse(input);

    return ok(course, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
