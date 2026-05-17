import { Award, BookOpen, Clock, Video } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";
import { StatCard } from "@/components/StatCard";
import { listClasses, listCourses, listNotifications } from "@/lib/store";

export const metadata = { title: "Student Dashboard" };

export default async function StudentDashboard() {
  const [courses, classes, notifications] = await Promise.all([listCourses(), listClasses(), listNotifications()]);
  const enrolledCourses = courses.filter((course) => course.enrolledStudentIds.length > 0);
  const upcomingClasses = classes;

  return (
    <DashboardShell role="Student">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Progress" value="68%" detail="Across enrolled courses" icon={Award} />
        <StatCard label="Courses" value={String(enrolledCourses.length)} detail="Active enrollments" icon={BookOpen} />
        <StatCard label="Practice" value="14h" detail="This month" icon={Clock} />
        <StatCard label="Live" value={String(upcomingClasses.length)} detail="Upcoming classes" icon={Video} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="courses">
          <h2 className="text-xl font-semibold">Enrolled courses</h2>
          <div className="mt-5 space-y-4">
            {enrolledCourses.map((course, index) => (
              <div key={course.id} className="rounded-lg border border-white/10 bg-[#070817] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#f4a742]">{course.instrument} - {course.level}</p>
                    <h3 className="mt-2 font-semibold">{course.title}</h3>
                  </div>
                  <span className="font-mono text-sm text-white/60">{index === 0 ? "72%" : "44%"}</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-[#f4a742]" style={{ width: index === 0 ? "72%" : "44%" }} />
                </div>
              </div>
            ))}
            {enrolledCourses.length === 0 && (
              <p className="rounded-lg border border-white/10 bg-[#070817] p-4 text-sm text-white/60">No enrolled courses yet.</p>
            )}
          </div>
        </section>
        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="live-classes">
          <h2 className="text-xl font-semibold">Live classes</h2>
          <div className="mt-5 space-y-4">
            {upcomingClasses.map((liveClass) => (
              <div key={liveClass.id} className="rounded-lg border border-white/10 bg-[#070817] p-4">
                <p className="text-sm text-[#f4a742]">{new Date(liveClass.startsAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                <h3 className="mt-2 font-semibold">{liveClass.title}</h3>
                <a href={liveClass.joinUrl} className="mt-4 inline-flex h-10 items-center rounded-lg bg-[#f4a742] px-4 text-sm font-semibold text-[#10101f]">
                  Join class
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.05] p-6">
        <h2 className="text-xl font-semibold">Notifications & recordings</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-lg bg-[#070817] p-4">
              <p className="font-semibold">{notification.title}</p>
              <p className="mt-2 text-sm text-white/58">{notification.body}</p>
            </div>
          ))}
          {classes.filter((item) => item.recordingUrl).map((item) => (
            <div key={item.id} className="rounded-lg bg-[#070817] p-4">
              <p className="font-semibold">{item.title} recording</p>
              <a href={item.recordingUrl} className="mt-2 inline-flex text-sm text-[#f4a742]">Open recording</a>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
