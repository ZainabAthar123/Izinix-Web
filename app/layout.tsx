import type { Metadata, Viewport } from "next";
import {
  Fraunces,
  Inter,
  JetBrains_Mono,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/layout/SmoothScroll";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import GrainOverlay from "@/components/layout/GrainOverlay";
import { PageTransitionProvider } from "@/components/layout/PageTransition";

/**
 * Font pairing (all variable, loaded via next/font — zero layout shift):
 *  - Space Grotesk  → display / headlines (weight animates 300→700)
 *  - Fraunces       → serif italic accents (quotes, "after" headlines)
 *  - Inter          → body copy
 *  - JetBrains Mono → eyebrows, labels, system chrome
 * Swap a face here and the whole site follows via the CSS variables.
 */
const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const serif = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Izinix — AI Automation Agency",
    template: "%s — Izinix",
  },
  description:
    "We automate what slows you down. Web development, UI/UX design, content, and AI automation — systems that run your business while you grow it.",
  keywords: [
    "AI automation agency",
    "web development",
    "UI/UX design",
    "content creation",
    "business automation",
  ],
  openGraph: {
    title: "Izinix — AI Automation Agency",
    description:
      "Web development, UI/UX design, content, and AI automation — systems that run your business while you grow it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-bg-primary font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
        >
          Skip to content
        </a>
        <PageTransitionProvider>
          <SmoothScroll>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScroll>
          <ScrollProgress />
          <CustomCursor />
          <GrainOverlay />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
