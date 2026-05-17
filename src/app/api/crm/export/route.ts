import { requireRole } from "@/lib/api";
import { listCourses, listUsers } from "@/lib/store";

function escapeCsv(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (auth.response) return auth.response;

  const [users, courses] = await Promise.all([listUsers(), listCourses()]);
  const rows = [
    ["type", "name", "email_or_title", "role_or_instrument", "status_or_level"].map(escapeCsv).join(","),
    ...users.map((user) =>
      ["user", user.name, user.email, user.role, user.approvalStatus].map(escapeCsv).join(","),
    ),
    ...courses.map((course) =>
      ["course", course.teacherName, course.title, course.instrument, course.level].map(escapeCsv).join(","),
    ),
  ];

  return new Response(rows.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=raagverse-crm-export.csv",
    },
  });
}
