import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/Customcursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TypeZero // The Entropy Killer",
    template: "%s // TypeZero"
  },
  description: "Stop hand-writing interfaces. The autonomous engineering agent that violently transforms raw JSON into strict, production-ready TypeScript, Zod, Pydantic and SQL.",
  keywords: ["JSON to TypeScript", "Zod Schema Generator", "SQL DDL", "Developer Tools", "Chaos Engineering"],
  authors: [{ name: "Shayan Mukherjee" }],
  openGraph: {
    title: "TypeZero // Structure from Pure Chaos",
    description: "Don't think. Just paste. Instant, local-first type inference for the modern web.",
    siteName: "TypeZero",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TypeZero // The Entropy Killer",
    description: "Turn your messy JSON into strict, type-safe production code. Instantly.",
    creator: "Shayan Mukherjee",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}