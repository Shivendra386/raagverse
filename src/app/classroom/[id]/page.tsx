import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageSquare, Mic, Radio, Video } from "lucide-react";
import { Logo } from "@/components/Logo";
import { findClassById } from "@/lib/store";

type ClassroomPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ provider?: string }>;
};

export default async function ClassroomPage({ params, searchParams }: ClassroomPageProps) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const liveClass = await findClassById(id);
  if (!liveClass) notFound();

  const provider = query.provider ?? liveClass.provider;

  return (
    <main className="min-h-screen bg-[#070817] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-5 sm:px-8">
        <Logo />
        <Link href="/dashboard/student" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white">
          Back to dashboard
        </Link>
      </header>
      <section className="grid min-h-[calc(100vh-81px)] gap-0 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col bg-[#050611]">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
            <div>
              <p className="text-sm text-[#f4a742]">{provider}</p>
              <h1 className="text-xl font-semibold">{liveClass.title}</h1>
            </div>
            <span className="rounded-lg bg-emerald-400/12 px-3 py-1 text-sm text-emerald-200">Ready</span>
          </div>
          <div className="grid flex-1 place-items-center p-4">
            <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-[linear-gradient(135deg,#10132d,#070817_55%,#24113d)] p-6">
              <div className="flex h-full flex-col justify-between">
                <div className="flex items-center gap-2 text-[#f4a742]">
                  <Radio className="size-5" />
                  <span className="text-sm font-medium">Live room</span>
                </div>
                <div>
                  <p className="font-serif text-5xl text-[#f7f3ec]">Raagverse Classroom</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">
                    {new Date(liveClass.startsAt).toLocaleString("en-IN")} - {liveClass.durationMinutes} minutes
                  </p>
                </div>
                <div className="flex gap-3">
                  {[Mic, Video, MessageSquare].map((Icon, index) => (
                    <button key={index} className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-white/75">
                      <Icon className="size-5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <aside className="border-l border-white/10 bg-[#0b0d22] p-5">
          <h2 className="text-lg font-semibold">Class chat</h2>
          <div className="mt-5 space-y-3">
            {["Welcome to the room.", "Teacher controls are ready.", "Recording will appear after upload."].map((message) => (
              <div key={message} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-white/68">
                {message}
              </div>
            ))}
          </div>
          <form className="mt-5 flex gap-2">
            <input className="h-10 min-w-0 flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm outline-none" placeholder="Message" />
            <button className="rounded-lg bg-[#f4a742] px-3 text-sm font-semibold text-[#10101f]">Send</button>
          </form>
        </aside>
      </section>
    </main>
  );
}
