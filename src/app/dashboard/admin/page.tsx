import { DashboardShell } from "@/components/DashboardShell";
import { AdminDashboardClient } from "@/components/dashboard/AdminDashboardClient";
import { sanitizeUser } from "@/lib/auth";
import { listClasses, listCourses, listUsers } from "@/lib/store";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [users, courses, classes] = await Promise.all([listUsers(), listCourses(), listClasses()]);

  return (
    <DashboardShell role="Admin">
      <AdminDashboardClient initialUsers={users.map(sanitizeUser)} courses={courses} classes={classes} />
    </DashboardShell>
  );
}
