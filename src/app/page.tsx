import Link from "next/link";
import { ArrowRight, CreditCard, Mic2, PlayCircle, ShieldCheck, Star, Video, WandSparkles } from "lucide-react";
import { seedBlogPosts, seedClasses, seedCourses } from "@/data/seed";
import { BrandShowcase } from "@/components/BrandShowcase";
import { MarketingNav } from "@/components/MarketingNav";

const features = [
  ["Role portals", "Student, teacher, and admin experiences with RBAC-ready APIs.", ShieldCheck],
  ["Live classes", "WebRTC classroom links plus Zoom and Google Meet provider hooks.", Video],
  ["Course commerce", "Course modules, purchases, and Razorpay/Stripe checkout sessions.", CreditCard],
  ["Practice intelligence", "AI feedback extension point for pitch and rhythm analysis.", WandSparkles],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070817] text-white">
      <MarketingNav />
      <section className="relative isolate overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_10%,rgba(75,30,111,0.72),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(244,167,66,0.2),transparent_27%),linear-gradient(180deg,#070817_0%,#0d1026_70%,#070817_100%)]" />
          <div className="absolute left-0 right-0 top-24 h-64 opacity-35 [background:repeating-linear-gradient(165deg,transparent_0,transparent_22px,rgba(244,167,66,0.18)_23px,transparent_24px)]" />
        </div>
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-lg border border-[#f4a742]/25 bg-[#f4a742]/10 px-3 py-2 text-sm font-medium text-[#f4a742]">
              <Mic2 className="size-4" />
              Premium online music school
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[1.04] text-[#f7f3ec] sm:text-7xl">
              Learn music live, track progress, and perform with soul.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Raagverse brings Indian classical depth and modern online learning together with live teacher-led classes, recorded modules, course commerce, CRM, analytics, and a premium brand system.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/courses" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f4a742] px-5 font-semibold text-[#10101f] shadow-[0_16px_45px_rgba(244,167,66,0.32)]">
                Explore courses
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/dashboard/student" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/15 px-5 font-semibold text-white transition hover:border-[#f4a742]/50 hover:text-[#f4a742]">
                View platform
                <PlayCircle className="size-4" />
              </Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              {[
                ["12k+", "students"],
                ["180+", "teachers"],
                ["4.9", "avg rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                  <p className="text-2xl font-semibold text-[#f4a742]">{value}</p>
                  <p className="mt-1 text-sm text-white/55">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.42)]">
            <div className="rounded-lg bg-[#10132d] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#f4a742]">Next live class</p>
                  <h2 className="mt-1 text-2xl font-semibold">{seedClasses[0].title}</h2>
                </div>
                <span className="rounded-lg bg-emerald-400/12 px-3 py-1 text-sm text-emerald-200">Live-ready</span>
              </div>
              <div className="mt-6 aspect-video overflow-hidden rounded-lg border border-[#f4a742]/25 bg-[linear-gradient(135deg,#1b0d2e,#070817_48%,#4b1e6f)] p-6">
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-center gap-2 text-[#f4a742]">
                    <Video className="size-5" />
                    <span className="text-sm font-medium">WebRTC classroom</span>
                  </div>
                  <div>
                    <p className="font-serif text-4xl">Raag Yaman</p>
                    <p className="mt-2 max-w-sm text-sm leading-6 text-white/65">Low-latency live learning with chat, recordings, attendance, and teacher controls.</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {seedCourses.slice(0, 2).map((course) => (
                  <Link key={course.id} href="/courses" className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-[#f4a742]/45">
                    <p className="text-sm text-white/55">{course.instrument}</p>
                    <h3 className="mt-2 font-semibold">{course.title}</h3>
                    <p className="mt-3 flex items-center gap-1 text-sm text-[#f4a742]">
                      <Star className="size-4 fill-current" />
                      {course.rating} ({course.reviews})
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/10 bg-[#0b0d22] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
          {features.map(([title, body, Icon]) => (
            <div key={title as string} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
              <Icon className="size-6 text-[#f4a742]" />
              <h3 className="mt-5 font-semibold">{title as string}</h3>
              <p className="mt-2 text-sm leading-6 text-white/60">{body as string}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f4a742]">Course system</p>
              <h2 className="mt-3 font-serif text-4xl text-[#f7f3ec]">Modules, chapters, recordings, reviews, and purchases.</h2>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-[#f4a742]">
              Browse all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {seedCourses.map((course) => (
              <article key={course.id} className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm text-[#f4a742]">{course.instrument} • {course.level}</p>
                <h3 className="mt-3 text-xl font-semibold">{course.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-white/62">{course.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-mono text-lg">₹{course.price.toLocaleString("en-IN")}</span>
                  <span className="flex items-center gap-1 text-sm text-[#f4a742]">
                    <Star className="size-4 fill-current" />
                    {course.rating}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <BrandShowcase />
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f4a742]">Content engine</p>
              <h2 className="mt-3 font-serif text-4xl">Music tips that drive SEO and retention.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {seedBlogPosts.map((post) => (
                <Link key={post.slug} href="/blog" className="rounded-lg border border-white/10 bg-white/[0.05] p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#f4a742]">{post.category}</p>
                  <h3 className="mt-4 font-semibold">{post.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/58">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-white/10 px-4 py-10 text-center text-sm text-white/52">
        <p>© 2026 Raagverse. Built for Vercel, Supabase, JWT auth, live classes, CRM, and payments.</p>
      </footer>
    </main>
  );
}
