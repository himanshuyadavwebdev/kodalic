import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";

const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

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
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex flex-col" suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
