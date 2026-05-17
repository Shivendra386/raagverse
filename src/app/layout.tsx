import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raagverse.vercel.app"),
  title: {
    default: "Raagverse | Online Music School",
    template: "%s | Raagverse",
  },
  description:
    "Raagverse is a premium online music school for live classes, course learning, teacher dashboards, admin CRM, and Indian classical fusion education.",
  openGraph: {
    title: "Raagverse",
    description: "Learn • Feel • Express",
    images: ["/brand-board.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
