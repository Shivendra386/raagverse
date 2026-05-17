import { ok, requireRole } from "@/lib/api";
import { platformAnalytics } from "@/lib/store";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.response) return auth.response;

  return ok(await platformAnalytics());
}
