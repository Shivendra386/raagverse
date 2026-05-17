import { NextRequest } from "next/server";
import { z } from "zod";
import { fail, handleApiError, ok, requireRole } from "@/lib/api";
import { updateClassRecording } from "@/lib/store";

const schema = z.object({
  recordingUrl: z.string().url(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireRole(["teacher", "admin"]);
    if (auth.response) return auth.response;

    const { id } = await params;
    const input = schema.parse(await request.json());
    const liveClass = await updateClassRecording(id, input.recordingUrl);

    if (!liveClass) return fail("Class not found", 404);
    return ok({ liveClass });
  } catch (error) {
    return handleApiError(error);
  }
}
