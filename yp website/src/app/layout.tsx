import type { Metadata } from "next";
import { Bricolage_Grotesque, Karla, Space_Mono } from "next/font/google";
import { MetaNav } from "@/components/MetaNav";
import { LinktreeFab } from "@/components/LinktreeFab";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const body = Karla({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <MetaNav />
        {children}
        <LinktreeFab />
      </body>
    </html>
  );
}
