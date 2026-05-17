import { DashboardShell } from "@/components/DashboardShell";
import { TeacherDashboardClient } from "@/components/dashboard/TeacherDashboardClient";
import { sanitizeUser } from "@/lib/auth";
import { listClasses, listCourses, listUsers } from "@/lib/store";

export const metadata = { title: "Teacher Dashboard" };

export default async function TeacherDashboard() {
  const [users, courses, classes] = await Promise.all([listUsers(), listCourses(), listClasses()]);
  const teacher = users.find((user) => user.role === "teacher" && user.approvalStatus === "approved") ?? users.find((user) => user.role === "teacher");
  const students = users.filter((user) => user.role === "student").map(sanitizeUser);
  const fallbackTeacher = {
    id: "teacher_local",
    name: "Raagverse Teacher",
    email: "teacher@raagverse.com",
    role: "teacher" as const,
    passwordHash: "",
    verified: true,
    approvalStatus: "approved" as const,
    instrument: "Vocal",
    level: "Advanced" as const,
    createdAt: new Date().toISOString(),
  };

  return (
    <DashboardShell role="Teacher">
      <TeacherDashboardClient
        initialCourses={courses}
        initialClasses={classes}
        students={students}
        teacher={sanitizeUser(teacher ?? fallbackTeacher)}
      />
    </DashboardShell>
  );
}
