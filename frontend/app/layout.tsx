import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./theme-provider";
import PageViewTracker from "../components/analytics/page-view-tracker";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "./seo";
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const isPreview = process.env.VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Kodalic — Engineering What Businesses Become Next", template: "%s | Kodalic" },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: isPreview
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  openGraph: { title: "Kodalic — Engineering What Businesses Become Next", description: "Intelligent technology solutions that help businesses evolve, automate, and compete.", type: "website", url: SITE_URL, siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: "Kodalic — Engineering What Businesses Become Next", description: "Intelligent technology solutions that help businesses evolve, automate, and compete." },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.png` }) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: SITE_NAME, url: SITE_URL, publisher: { "@type": "Organization", name: SITE_NAME } }) }} />
        <ThemeProvider>{children}</ThemeProvider>
        <PageViewTracker />
      </body>
    </html>
  );
}
