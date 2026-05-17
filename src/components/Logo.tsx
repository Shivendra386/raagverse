import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="Raagverse home">
      <span className="relative grid size-11 place-items-center overflow-hidden rounded-lg border border-[#f4a742]/30 bg-[#0d1026] shadow-[0_0_32px_rgba(244,167,66,0.18)]">
        <svg viewBox="0 0 64 64" className="size-9" role="img" aria-label="Raagverse R icon">
          <defs>
            <linearGradient id="raag-gold" x1="10" x2="54" y1="8" y2="58" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fff2b8" />
              <stop offset="0.45" stopColor="#f4a742" />
              <stop offset="1" stopColor="#b96a21" />
            </linearGradient>
          </defs>
          <path
            d="M18 50V10h15c9 0 15 5 15 13 0 6-3 10-9 12l11 15h-9L31 36h-5v14h-8Zm8-21h7c4 0 7-2 7-6s-3-6-7-6h-7v12Z"
            fill="url(#raag-gold)"
          />
          <path d="M15 46c10 6 25 6 35-1" fill="none" stroke="#f4a742" strokeLinecap="round" strokeWidth="2" />
          <path d="M15 38c9 5 24 5 33-1" fill="none" stroke="#f4a742" strokeLinecap="round" strokeOpacity=".55" />
          <circle cx="49" cy="24" r="3" fill="#f4a742" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block font-serif text-2xl tracking-[0.18em] text-[#f7f3ec]">RAAGVERSE</span>
          <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.36em] text-[#f4a742]">
            Learn • Feel • Express
          </span>
        </span>
      )}
    </Link>
  );
}
