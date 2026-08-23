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
  title: "Kodalic — Engineering What Businesses Become Next",
  description:
    "Kodalic builds intelligent technology solutions — websites, AI, automation, and digital products — that help businesses evolve, automate, and compete in a digital-first world.",
  keywords: [
    "Kodalic",
    "software development",
    "AI solutions",
    "business automation",
    "web development",
    "digital solutions",
  ],
  openGraph: {
    title: "Kodalic — Engineering What Businesses Become Next",
    description:
      "Intelligent technology solutions that help businesses evolve, automate, and compete.",
    type: "website",
    url: "https://kodalic.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kodalic — Engineering What Businesses Become Next",
    description:
      "Intelligent technology solutions that help businesses evolve, automate, and compete.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
