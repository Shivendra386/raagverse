import Link from "next/link";
import type { ReactNode } from "react";
import { Bell, CalendarDays, CreditCard, LayoutDashboard, Library, LogOut, MessageSquare, Settings, Users } from "lucide-react";
import { Logo } from "@/components/Logo";

type DashboardShellProps = {
  role: "Student" | "Teacher" | "Admin";
  children: ReactNode;
};

const navByRole = {
  Student: [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Courses", icon: Library },
    { label: "Live classes", icon: CalendarDays },
    { label: "Payments", icon: CreditCard },
  ],
  Teacher: [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Courses", icon: Library },
    { label: "Schedule", icon: CalendarDays },
    { label: "Students", icon: Users },
  ],
  Admin: [
    { label: "Overview", icon: LayoutDashboard },
    { label: "Users", icon: Users },
    { label: "CRM", icon: MessageSquare },
    { label: "Settings", icon: Settings },
  ],
};

export function DashboardShell({ role, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#070817] text-white">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-white/10 bg-[#0b0d22] p-6 lg:block">
        <Logo />
        <div className="mt-8 rounded-lg border border-[#f4a742]/20 bg-[#f4a742]/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-[#f4a742]">{role} portal</p>
          <p className="mt-2 text-sm text-white/72">Role-based tools, live class controls, CRM, and learning progress.</p>
        </div>
        <nav className="mt-8 space-y-2">
          {navByRole[role].map((item, index) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                index === 0 ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="size-4" />
              {item.label}
            </a>
          ))}
        </nav>
        <Link href="/" className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-lg border border-white/10 px-3 py-2.5 text-sm text-white/65 hover:text-white">
          <LogOut className="size-4" />
          Back to site
        </Link>
      </aside>
      <main className="lg:pl-72">
        <header className="flex h-20 items-center justify-between border-b border-white/10 px-4 sm:px-8">
          <div>
            <p className="text-sm text-[#f4a742]">Raagverse</p>
            <h1 className="text-2xl font-semibold">{role} Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70" aria-label="Notifications">
              <Bell className="size-4" />
            </button>
            <Link href="/auth" className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#10101f]">
              Login
            </Link>
          </div>
        </header>
        <div className="px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
