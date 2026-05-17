"use client";

import { useMemo, useState } from "react";
import { BarChart3, Download, IndianRupee, Settings, UserCheck, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import type { Course, LiveClass, User } from "@/lib/types";

type PublicUser = Omit<User, "passwordHash">;

type AdminDashboardClientProps = {
  initialUsers: PublicUser[];
  courses: Course[];
  classes: LiveClass[];
};

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  data?: T;
};

export function AdminDashboardClient({ initialUsers, courses, classes }: AdminDashboardClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const stats = useMemo(() => {
    const revenue = courses.reduce((sum, course) => sum + course.price * course.enrolledStudentIds.length, 0);
    return {
      students: users.filter((user) => user.role === "student").length,
      teachers: users.filter((user) => user.role === "teacher" && user.approvalStatus === "approved").length,
      revenue,
      classes: classes.length,
    };
  }, [classes.length, courses, users]);

  async function updateApproval(userId: string, approvalStatus: PublicUser["approvalStatus"]) {
    setBusyUserId(userId);
    setMessage(null);

    const response = await fetch(`/api/admin/teachers/${userId}/approval`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ approvalStatus }),
    });
    const result = (await response.json()) as ApiResponse<{ user: PublicUser }>;
    setBusyUserId(null);

    if (!result.ok || !result.data?.user) {
      setMessage(result.message ?? "Approval update failed.");
      return;
    }

    setUsers((items) => items.map((item) => (item.id === userId ? { ...item, ...result.data!.user } : item)));
    setMessage(`Teacher ${approvalStatus}.`);
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Students" value={String(stats.students)} detail="Total learners" icon={Users} />
        <StatCard label="Teachers" value={String(stats.teachers)} detail="Approved faculty" icon={UserCheck} />
        <StatCard label="Revenue" value={`INR ${stats.revenue.toLocaleString("en-IN")}`} detail="Course purchases" icon={IndianRupee} />
        <StatCard label="Classes" value={String(stats.classes)} detail="Live schedule" icon={BarChart3} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="users">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Manage users</h2>
            <a href="/api/crm/export" className="inline-flex items-center gap-2 rounded-lg bg-[#f4a742] px-4 py-2 text-sm font-semibold text-[#10101f]">
              <Download className="size-4" />
              Export CSV
            </a>
          </div>
          <div className="mt-5 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="bg-white/[0.04] text-white/60">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-white/10">
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3 capitalize text-white/60">{user.role}</td>
                    <td className="px-4 py-3 text-white/60">{user.approvalStatus}</td>
                    <td className="px-4 py-3">
                      {user.role === "teacher" && user.approvalStatus === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApproval(user.id, "approved")}
                            disabled={busyUserId === user.id}
                            className="rounded-lg bg-emerald-400/15 px-3 py-1 text-emerald-200 disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateApproval(user.id, "rejected")}
                            disabled={busyUserId === user.id}
                            className="rounded-lg bg-red-400/15 px-3 py-1 text-red-100 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-white/35">Managed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {message && <p className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/70">{message}</p>}
        </section>
        <section className="rounded-lg border border-white/10 bg-white/[0.05] p-6" id="crm">
          <h2 className="text-xl font-semibold">Admin CRM</h2>
          <div className="mt-5 space-y-4">
            {["Follow up with pending teacher verification", "Send course launch message to vocal students", "Review low attendance learners", "Sync payment settlement report"].map((task) => (
              <div key={task} className="rounded-lg border border-white/10 bg-[#070817] p-4 text-sm text-white/70">
                {task}
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg border border-[#f4a742]/25 bg-[#f4a742]/10 p-4">
            <div className="flex items-center gap-3 text-[#f4a742]">
              <Settings className="size-5" />
              <p className="font-semibold">Platform settings</p>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/60">Payment, live class, email, branding, and approval policy are now backed by route handlers and environment configuration.</p>
          </div>
        </section>
      </div>
    </>
  );
}
