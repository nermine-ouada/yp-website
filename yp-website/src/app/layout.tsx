import type { Metadata } from "next";
import { MetaNav } from "@/components/MetaNav";
import { LinktreeFab } from "@/components/LinktreeFab";
import "./globals.css";

// Fonts load from Google Fonts in the browser rather than through
// next/font/google: that downloads them at build time, and Turbopack fails
// the whole build whenever Google answers with its "kit" style font URLs
// (seen on Vercel). The CSS variables they feed are defined in globals.css.
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Karla:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap";

export const metadata: Metadata = {
  title: {
    default: "IEEE Young Professionals Tunisia",
    template: "%s · IEEE YP Tunisia",
  },
  description:
    "IEEE Young Professionals Tunisia Affinity Group: events, officers, and a pinboard of scholarships, fellowships and internships.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href={FONTS_URL} />
      </head>
      <body>
        <MetaNav />
        {children}
        <LinktreeFab />
      </body>
    </html>
  );
}
