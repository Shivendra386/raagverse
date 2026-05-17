import { NextRequest } from "next/server";
import { handleApiError, ok, requireRole } from "@/lib/api";
import { createClass, listClasses } from "@/lib/store";
import { classSchema } from "@/lib/validation";

export async function GET() {
  const auth = await requireRole(["student", "teacher", "admin"]);
  if (auth.response) return auth.response;

  return ok(await listClasses());
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(["teacher", "admin"]);
    if (auth.response) return auth.response;

    const input = classSchema.parse(await request.json());
    const liveClass = await createClass(input);

    return ok(liveClass, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
