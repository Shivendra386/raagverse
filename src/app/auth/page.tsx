"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, KeyRound, LockKeyhole, Mail, Music2, UserRound } from "lucide-react";
import { Logo } from "@/components/Logo";

type Role = "student" | "teacher";
type AuthMode = "login" | "signup";

type ApiResponse = {
  ok: boolean;
  message?: string;
  data?: {
    user?: {
      role: "admin" | "teacher" | "student";
      approvalStatus: "approved" | "pending" | "rejected";
    };
    delivery?: string;
    nextStep?: string;
  };
};

function dashboardFor(role: "admin" | "teacher" | "student") {
  if (role === "admin") return "/dashboard/admin";
  if (role === "teacher") return "/dashboard/teacher";
  return "/dashboard/student";
}

export default function AuthPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("student@raagverse.com");
  const [password, setPassword] = useState("raagverse123");
  const [instrument, setInstrument] = useState("");
  const [otp, setOtp] = useState("");
  const [needsOtp, setNeedsOtp] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body =
      authMode === "login"
        ? { email, password }
        : {
            name,
            email,
            password,
            role,
            instrument: instrument || undefined,
          };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const result = (await response.json()) as ApiResponse;
    setLoading(false);

    if (!result.ok) {
      setError(result.message ?? "Something went wrong.");
      return;
    }

    if (result.data?.user) {
      router.push(dashboardFor(result.data.user.role));
      return;
    }

    setNeedsOtp(true);
    setStatus("OTP sent to your email. Enter it below to continue.");
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);

    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        otp,
        purpose: "email-verification",
      }),
    });
    const result = (await response.json()) as ApiResponse;
    setLoading(false);

    if (!result.ok || !result.data?.user) {
      setError(result.message ?? "Invalid OTP.");
      return;
    }

    if (result.data.user.role === "teacher" && result.data.user.approvalStatus !== "approved") {
      setStatus("Email verified. Your teacher account is waiting for admin approval.");
      return;
    }

    router.push(dashboardFor(result.data.user.role));
  }

  return (
    <main className="min-h-screen bg-[#070817] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <div className="flex items-center justify-between">
          <Logo />
          <Link href="/" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white">
            Back home
          </Link>
        </div>
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.05] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f4a742]">Login system</p>
            <h1 className="mt-4 font-serif text-5xl text-[#f7f3ec]">Sign in to Raagverse.</h1>
            <p className="mt-5 leading-8 text-white/64">
              The login system lives at <span className="font-mono text-[#f4a742]">/auth</span>. With Supabase env vars, it sends email OTP. Without Supabase, demo password login still works:
              <span className="mt-3 block font-mono text-sm text-[#f4a742]">student@raagverse.com / raagverse123</span>
              <span className="block font-mono text-sm text-[#f4a742]">teacher@raagverse.com / raagverse123</span>
            </p>
            <div className="mt-8 space-y-4">
              {["Supabase email OTP signup and login", "OTP verification sets HTTP-only app JWT", "Teacher accounts wait for admin approval", "Protected APIs use role-based access control"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/70">
                  <CheckCircle2 className="size-5 text-[#f4a742]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#0b0d22] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.36)]">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.04] p-1">
              {(["login", "signup"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setAuthMode(item);
                    setNeedsOtp(false);
                    setError(null);
                    setStatus(null);
                  }}
                  className={`h-11 rounded-md text-sm font-semibold capitalize transition ${
                    authMode === item ? "bg-[#f4a742] text-[#10101f]" : "text-white/65 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {!needsOtp ? (
              <form className="mt-6 grid gap-4" onSubmit={submitAuth}>
                {authMode === "signup" && (
                  <>
                    <div className="grid grid-cols-2 gap-2 rounded-lg bg-white/[0.04] p-1">
                      {(["student", "teacher"] as const).map((item) => (
                        <button
                          type="button"
                          key={item}
                          onClick={() => setRole(item)}
                          className={`h-10 rounded-md text-sm font-semibold capitalize transition ${
                            role === item ? "bg-white text-[#10101f]" : "text-white/65 hover:text-white"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                    <label className="grid gap-2 text-sm text-white/72">
                      Full name
                      <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                        <UserRound className="size-4 text-[#f4a742]" />
                        <input value={name} onChange={(event) => setName(event.target.value)} className="h-12 flex-1 bg-transparent outline-none" placeholder="Isha Kapoor" required />
                      </span>
                    </label>
                  </>
                )}
                <label className="grid gap-2 text-sm text-white/72">
                  Email
                  <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                    <Mail className="size-4 text-[#f4a742]" />
                    <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-12 flex-1 bg-transparent outline-none" placeholder="student@raagverse.com" required />
                  </span>
                </label>
                <label className="grid gap-2 text-sm text-white/72">
                  Password
                  <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                    <LockKeyhole className="size-4 text-[#f4a742]" />
                    <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="h-12 flex-1 bg-transparent outline-none" placeholder="Only needed for local demo fallback" />
                  </span>
                </label>
                {authMode === "signup" && (
                  <label className="grid gap-2 text-sm text-white/72">
                    Instrument
                    <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                      <Music2 className="size-4 text-[#f4a742]" />
                      <input value={instrument} onChange={(event) => setInstrument(event.target.value)} className="h-12 flex-1 bg-transparent outline-none" placeholder="Vocal, Sitar, Piano..." />
                    </span>
                  </label>
                )}
                <button disabled={loading} className="mt-2 h-12 rounded-lg bg-[#f4a742] font-semibold text-[#10101f] shadow-[0_16px_45px_rgba(244,167,66,0.26)] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Please wait..." : authMode === "login" ? "Login / send OTP" : `Create ${role} account`}
                </button>
              </form>
            ) : (
              <form className="mt-6 grid gap-4" onSubmit={verifyOtp}>
                <label className="grid gap-2 text-sm text-white/72">
                  Email OTP
                  <span className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3">
                    <KeyRound className="size-4 text-[#f4a742]" />
                    <input value={otp} onChange={(event) => setOtp(event.target.value)} className="h-12 flex-1 bg-transparent outline-none" placeholder="6-digit code" minLength={6} maxLength={6} required />
                  </span>
                </label>
                <button disabled={loading} className="mt-2 h-12 rounded-lg bg-[#f4a742] font-semibold text-[#10101f] shadow-[0_16px_45px_rgba(244,167,66,0.26)] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
            )}

            {status && <p className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-100">{status}</p>}
            {error && <p className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
          </div>
        </section>
      </div>
    </main>
  );
}
