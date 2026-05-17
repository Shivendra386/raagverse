import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/62">{label}</p>
        <span className="grid size-10 place-items-center rounded-lg bg-[#f4a742]/12 text-[#f4a742]">
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold">{value}</p>
      <p className="mt-2 text-sm text-white/55">{detail}</p>
    </div>
  );
}
