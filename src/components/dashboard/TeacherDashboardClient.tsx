"use client";

import { FormEvent, useMemo, useState } from "react";
import { BookOpen, CalendarPlus, Upload, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import type { Course, LiveClass, User } from "@/lib/types";

type PublicUser = Omit<User, "passwordHash">;

type TeacherDashboardClientProps = {
  initialCourses: Course[];
  initialClasses: LiveClass[];
  students: PublicUser[];
  teacher: PublicUser;
};

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  data?: T;
};

const defaultClassTime = () => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

export function TeacherDashboardClient({ initialCourses, initialClasses, students, teacher }: TeacherDashboardClientProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [classes, setClasses] = useState(initialClasses);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    instrument: teacher.instrument ?? "Vocal",
    price: "4999",
    level: "Beginner",
  });
  const [classForm, setClassForm] = useState({
    courseId: initialCourses[0]?.id ?? "",
    title: "",
    startsAt: defaultClassTime(),
    durationMinutes: "60",
    provider: "webrtc",
  });
  const [recordingUrls, setRecordingUrls] = useState<Record<string, string>>({});

  const recordings = useMemo(() => classes.filter((item) => item.recordingUrl).length, [classes]);

  async function createCourse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("course");
    setMessage(null);

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...courseForm,
        teacherId: teacher.id,
        teacherName: teacher.name,
        price: Number(courseForm.price),
        modules: [
          {
            title: "Foundation module",
            chapters: [{ title: "Opening lesson", duration: "30m" }],
          },
        ],
      }),
    });
    const result = (await response.json()) as ApiResponse<Course>;
    setLoading(null);

    if (!result.ok || !result.data) {
      setMessage(result.message ?? "Course creation failed.");
      return;
    }

    setCourses((items) => [result.data!, ...items]);
    setClassForm((item) => ({ ...item, courseId: result.data!.id }));
    setCourseForm((item) => ({ ...item, title: "", description: "" }));
    setMessage("Course created.");
  }

  async function createLiveClass(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading("class");
    setMessage(null);

    const response = await fetch("/api/classes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...classForm,
        teacherId: teacher.id,
        startsAt: new Date(classForm.startsAt).toISOString(),
        durationMinutes: Number(classForm.durationMinutes),
        chatEnabled: true,
      }),
    });
    const result = (await response.json()) as ApiResponse<LiveClass>;
    setLoading(null);

    if (!result.ok || !result.data) {
      setMessage(result.message ?? "Class scheduling failed.");
      return;
    }

    setClasses((items) => [...items, result.data!]);
    setClassForm((item) => ({ ...item, title: "", startsAt: defaultClassTime() }));
    setMessage("Live class scheduled.");
  }

  async function uploadRecording(classId: string) {
    const recordingUrl = recordingUrls[classId];
    if (!recordingUrl) return;

    setLoading(classId);
    setMessage(null);
    const response = await fetch(`/api/classes/${classId}/recording`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ recordingUrl }),
    });
    const result = (await response.json()) as ApiResponse<{ liveClass: LiveClass }>;
    setLoading(null);

    if (!result.ok || !result.data?.liveClass) {
      setMessage(result.message ?? "Recording update failed.");
      return;
    }

    setClasses((items) => items.map((item) => (item.id === classId ? result.data!.liveClass : item)));
    setRecordingUrls((items) => ({ ...items, [classId]: "" }));
    setMessage("Recording linked.");
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Courses" value={String(courses.length)} detail="Created by faculty" icon={BookOpen} />
        <StatCard label="Students" value={String(students.length)} detail="Active learners" icon={Users} />
        <StatCard label="Classes" value={String(classes.length)} detail="Scheduled sessions" icon={CalendarPlus} />
        <StatCard label="Recordings" value={String(recordings)} detail="Uploaded lectures" icon={Upload} />
      </div>

      {message && <p className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/72">{message}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="courses">
          <h2 className="text-xl font-semibold">Manage courses</h2>
          <form className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-[#070817] p-4" onSubmit={createCourse}>
            <input value={courseForm.title} onChange={(event) => setCourseForm((item) => ({ ...item, title: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Course title" required />
            <textarea value={courseForm.description} onChange={(event) => setCourseForm((item) => ({ ...item, description: event.target.value }))} className="min-h-24 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm outline-none" placeholder="Course description" required />
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={courseForm.instrument} onChange={(event) => setCourseForm((item) => ({ ...item, instrument: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Instrument" required />
              <input value={courseForm.price} onChange={(event) => setCourseForm((item) => ({ ...item, price: event.target.value }))} type="number" min="0" className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Price" required />
              <select value={courseForm.level} onChange={(event) => setCourseForm((item) => ({ ...item, level: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-[#10132d] px-3 text-sm outline-none">
                {["Beginner", "Intermediate", "Advanced", "All Levels"].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </div>
            <button disabled={loading === "course"} className="h-11 rounded-lg bg-[#f4a742] px-4 text-sm font-semibold text-[#10101f] disabled:opacity-50">
              {loading === "course" ? "Creating..." : "Create course"}
            </button>
          </form>
          <div className="mt-5 space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="rounded-lg border border-white/10 bg-[#070817] p-4">
                <p className="text-sm text-[#f4a742]">{course.instrument}</p>
                <h3 className="mt-2 font-semibold">{course.title}</h3>
                <p className="mt-2 text-sm text-white/55">{course.enrolledStudentIds.length} enrolled - INR {course.price.toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="schedule">
          <h2 className="text-xl font-semibold">Schedule live class</h2>
          <form className="mt-5 grid gap-3 rounded-lg border border-white/10 bg-[#070817] p-4" onSubmit={createLiveClass}>
            <select value={classForm.courseId} onChange={(event) => setClassForm((item) => ({ ...item, courseId: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-[#10132d] px-3 text-sm outline-none">
              {courses.map((course) => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
            <input value={classForm.title} onChange={(event) => setClassForm((item) => ({ ...item, title: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Session title" required />
            <div className="grid gap-3 sm:grid-cols-3">
              <input value={classForm.startsAt} onChange={(event) => setClassForm((item) => ({ ...item, startsAt: event.target.value }))} type="datetime-local" className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" required />
              <input value={classForm.durationMinutes} onChange={(event) => setClassForm((item) => ({ ...item, durationMinutes: event.target.value }))} type="number" min="15" max="240" className="h-11 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" required />
              <select value={classForm.provider} onChange={(event) => setClassForm((item) => ({ ...item, provider: event.target.value }))} className="h-11 rounded-lg border border-white/10 bg-[#10132d] px-3 text-sm outline-none">
                {["webrtc", "zoom", "google-meet"].map((provider) => (
                  <option key={provider}>{provider}</option>
                ))}
              </select>
            </div>
            <button disabled={loading === "class" || !classForm.courseId} className="h-11 rounded-lg bg-[#f4a742] px-4 text-sm font-semibold text-[#10101f] disabled:opacity-50">
              {loading === "class" ? "Scheduling..." : "Schedule class"}
            </button>
          </form>
          <div className="mt-5 space-y-4">
            {classes.map((liveClass) => (
              <div key={liveClass.id} className="rounded-lg border border-white/10 bg-[#070817] p-4">
                <p className="text-sm text-[#f4a742]">{liveClass.provider}</p>
                <h3 className="mt-2 font-semibold">{liveClass.title}</h3>
                <p className="mt-2 text-sm text-white/55">{new Date(liveClass.startsAt).toLocaleString("en-IN")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a href={liveClass.joinUrl} className="rounded-lg bg-[#f4a742] px-3 py-2 text-sm font-semibold text-[#10101f]">Start session</a>
                  <input value={recordingUrls[liveClass.id] ?? ""} onChange={(event) => setRecordingUrls((items) => ({ ...items, [liveClass.id]: event.target.value }))} className="h-10 min-w-56 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Recording URL" />
                  <button onClick={() => uploadRecording(liveClass.id)} disabled={loading === liveClass.id} className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/70 disabled:opacity-50">Save recording</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-lg border border-white/10 bg-white/[0.05] p-6" id="students">
        <h2 className="text-xl font-semibold">Students & attendance</h2>
        <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-white/[0.04] text-white/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Instrument</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-white/10">
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-white/60">{student.instrument ?? "General"}</td>
                  <td className="px-4 py-3 text-white/60">{student.level ?? "Beginner"}</td>
                  <td className="px-4 py-3 text-[#f4a742]">92%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
