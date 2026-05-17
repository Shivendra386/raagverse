import Link from "next/link";
import { Menu, Search, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/dashboard/student", label: "Student" },
  { href: "/dashboard/teacher", label: "Teacher" },
  { href: "/dashboard/admin", label: "Admin" },
  { href: "/brand", label: "Brand" },
  { href: "/blog", label: "Blog" },
];

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070817]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-white/70 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-[#f4a742]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="hidden size-10 place-items-center rounded-lg border border-white/10 text-white/70 transition hover:border-[#f4a742]/50 hover:text-[#f4a742] sm:grid"
            aria-label="Search courses"
          >
            <Search className="size-4" />
          </Link>
          <Link
            href="/auth"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f4a742] px-4 text-sm font-semibold text-[#10101f] shadow-[0_12px_30px_rgba(244,167,66,0.28)] transition hover:bg-[#ffd06a]"
          >
            <Sparkles className="size-4" />
            Join now
          </Link>
          <button className="grid size-10 place-items-center rounded-lg border border-white/10 text-white/70 lg:hidden" aria-label="Menu">
            <Menu className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
