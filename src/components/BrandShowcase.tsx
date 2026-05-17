import Image from "next/image";
import { Disc3, Music2, RadioTower, Shirt, Smartphone, Waves } from "lucide-react";
import { Logo } from "@/components/Logo";

const swatches = [
  ["Gold", "#f4a742"],
  ["Deep Navy", "#0d1026"],
  ["Royal Purple", "#4b1e6f"],
  ["Off White", "#f7f3ec"],
  ["Charcoal", "#222222"],
];

export function BrandShowcase() {
  return (
    <section className="bg-[#f7f3ec] px-4 py-20 text-[#171421] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b96a21]">Brand system</p>
            <h2 className="mt-3 max-w-xl font-serif text-4xl text-[#0d1026] sm:text-5xl">Indian classical soul, modern learning platform.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#47404c]">
              Raagverse uses a stylized R, sitar-inspired curves, and waveform rings to feel premium, musical, and scalable across product, print, and studio signage.
            </p>
          </div>
          <div className="rounded-lg bg-[#070817] p-6">
            <Logo />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                ["Primary", Music2],
                ["Icon", Disc3],
                ["Waveform", Waves],
                ["Studio", RadioTower],
              ].map(([label, Icon]) => (
                <div key={label as string} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-white">
                  <Icon className="size-6 text-[#f4a742]" />
                  <p className="mt-6 text-sm">{label as string}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-lg border border-[#0d1026]/10 bg-white p-6">
            <h3 className="font-serif text-2xl text-[#0d1026]">Color Palette</h3>
            <div className="mt-6 grid grid-cols-5 gap-3">
              {swatches.map(([name, color]) => (
                <div key={name}>
                  <div className="h-16 rounded-lg border border-black/10" style={{ background: color }} />
                  <p className="mt-2 text-xs font-medium">{name}</p>
                  <p className="font-mono text-[0.68rem] text-[#665c65]">{color}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-[#0d1026]/10 bg-white p-6">
            <h3 className="font-serif text-2xl text-[#0d1026]">Typography</h3>
            <p className="mt-6 font-serif text-4xl tracking-[0.12em] text-[#0d1026]">RAAGVERSE</p>
            <p className="mt-4 text-lg font-semibold">Learn • Feel • Express</p>
            <p className="mt-6 text-sm leading-7 text-[#665c65]">Logo: elegant high-contrast serif. Interface: Geist Sans. Metrics and IDs: Geist Mono.</p>
          </div>
          <div className="rounded-lg border border-[#0d1026]/10 bg-[#0d1026] p-6 text-white">
            <h3 className="font-serif text-2xl">Mockup Kit</h3>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-4 text-[#0d1026]">
                <Smartphone className="size-6 text-[#f4a742]" />
                <p className="mt-8 text-sm font-semibold">App icon</p>
              </div>
              <div className="rounded-lg bg-[#f4a742] p-4 text-[#0d1026]">
                <Shirt className="size-6" />
                <p className="mt-8 text-sm font-semibold">Merch</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 overflow-hidden rounded-lg border border-[#0d1026]/10 bg-white">
          <Image src="/brand-board.png" alt="Raagverse brand identity board" width={1536} height={1536} className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
