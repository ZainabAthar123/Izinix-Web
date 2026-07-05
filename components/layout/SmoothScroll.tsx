"use client";

/**
 * Lenis inertia scrolling wired into GSAP's ticker, with ScrollTrigger
 * kept in sync on every scroll frame. Scroll velocity is published to
 * `scrollState` so the Three.js background can react to it.
 *
 * Skipped entirely under prefers-reduced-motion (native scrolling).
 */
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollState } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });
    scrollState.lenis = lenis;

    lenis.on("scroll", (e: { velocity: number }) => {
      scrollState.velocity = e.velocity;
      ScrollTrigger.update();
    });

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Layout can shift once fonts/images resolve — re-measure triggers.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
      scrollState.lenis = null;
      scrollState.velocity = 0;
    };
  }, []);

  return <>{children}</>;
}
