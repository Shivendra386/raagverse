"use client";

import { useMemo, useState } from "react";
import { Filter, Search, Star } from "lucide-react";
import type { CheckoutSession, Course } from "@/lib/types";

type CourseCatalogProps = {
  courses: Course[];
};

type ApiResponse<T> = {
  ok: boolean;
  message?: string;
  data?: T;
};

const filters = ["All", "Vocal", "Sitar", "Piano", "Beginner", "Intermediate", "Advanced"];

export function CourseCatalog({ courses }: CourseCatalogProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [provider, setProvider] = useState<"razorpay" | "stripe">("razorpay");
  const [message, setMessage] = useState<string | null>(null);
  const [busyCourseId, setBusyCourseId] = useState<string | null>(null);

  const visibleCourses = useMemo(() => {
    const query = search.toLowerCase();
    return courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instrument.toLowerCase().includes(query) ||
        course.level.toLowerCase().includes(query);
      const matchesFilter =
        activeFilter === "All" || course.instrument === activeFilter || course.level === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, courses, search]);

  async function enroll(courseId: string) {
    setBusyCourseId(courseId);
    setMessage(null);

    const checkoutResponse = await fetch("/api/payments/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ courseId, provider, currency: provider === "stripe" ? "USD" : "INR" }),
    });
    const checkout = (await checkoutResponse.json()) as ApiResponse<CheckoutSession>;

    if (!checkout.ok || !checkout.data) {
      setBusyCourseId(null);
      setMessage(checkout.message ?? "Login first, then start checkout.");
      return;
    }

    if (checkout.data.checkoutUrl && !checkout.data.simulated) {
      window.location.assign(checkout.data.checkoutUrl);
      return;
    }

    const enrollResponse = await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
    const enrollment = (await enrollResponse.json()) as ApiResponse<{ course: Course }>;
    setBusyCourseId(null);

    if (!enrollment.ok) {
      setMessage(enrollment.message ?? "Enrollment failed.");
      return;
    }

    setMessage(checkout.data.simulated ? "Demo checkout complete. Course enrolled." : "Course enrolled.");
  }

  return (
    <>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f4a742]">Course catalog</p>
          <h1 className="mt-3 font-serif text-5xl">Find your sound.</h1>
          <p className="mt-4 max-w-2xl text-white/62">Browse modules, chapters, recorded lessons, reviews, pricing, and enrollment-ready courses.</p>
        </div>
        <div className="flex w-full max-w-xl items-center gap-3 rounded-lg border border-white/10 bg-white/[0.05] px-4">
          <Search className="size-5 text-[#f4a742]" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="h-12 flex-1 bg-transparent text-sm outline-none" placeholder="Search vocal, sitar, piano, beginner..." />
          <Filter className="size-5 text-white/45" />
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              activeFilter === filter
                ? "border-[#f4a742] bg-[#f4a742] text-[#10101f]"
                : "border-white/10 text-white/70 hover:border-[#f4a742]/50 hover:text-[#f4a742]"
            }`}
          >
            {filter}
          </button>
        ))}
        <select value={provider} onChange={(event) => setProvider(event.target.value as "razorpay" | "stripe")} className="h-10 rounded-lg border border-white/10 bg-[#10132d] px-3 text-sm outline-none">
          <option value="razorpay">Razorpay</option>
          <option value="stripe">Stripe</option>
        </select>
      </div>
      {message && <p className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/72">{message}</p>}
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {visibleCourses.map((course) => (
          <article key={course.id} className="flex flex-col rounded-lg border border-white/10 bg-[#0b0d22] p-5">
            <div className="flex items-center justify-between">
              <span className="rounded-lg bg-[#f4a742]/12 px-3 py-1 text-sm text-[#f4a742]">{course.instrument}</span>
              <span className="flex items-center gap-1 text-sm text-[#f4a742]">
                <Star className="size-4 fill-current" />
                {course.rating}
              </span>
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{course.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-7 text-white/62">{course.description}</p>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-white/55">Modules</p>
              <p className="mt-1 font-semibold">{course.modules.length} modules - {course.modules.reduce((sum, item) => sum + item.chapters.length, 0)} chapters</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xl">INR {course.price.toLocaleString("en-IN")}</p>
                <p className="text-xs text-white/45">{course.level}</p>
              </div>
              <button onClick={() => enroll(course.id)} disabled={busyCourseId === course.id} className="rounded-lg bg-[#f4a742] px-4 py-2 text-sm font-semibold text-[#10101f] disabled:opacity-50">
                {busyCourseId === course.id ? "Starting..." : "Enroll"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
