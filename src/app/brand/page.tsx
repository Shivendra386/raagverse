import { BrandShowcase } from "@/components/BrandShowcase";
import { MarketingNav } from "@/components/MarketingNav";

export const metadata = {
  title: "Brand Identity",
  description: "Raagverse brand identity board with logo variations, palette, typography, and mockups.",
};

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-[#070817]">
      <MarketingNav />
      <BrandShowcase />
    </main>
  );
}
