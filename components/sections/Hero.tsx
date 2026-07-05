"use client";

/**
 * Homepage hero: full-viewport, Three.js particle field underneath,
 * word-staggered display headline with an animated variable-font weight,
 * pillar chips, magnetic CTAs, and a scroll cue that fades on scroll.
 */
import dynamic from "next/dynamic";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/icons";

// Code-split the Three.js bundle away from the initial page load.
const HeroBackground = dynamic(
  () => import("@/components/three/HeroBackground"),
  { ssr: false },
);

const pillars = ["Web Development", "UI/UX Design", "Content", "AI Automation"];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.fromTo(
          "[data-hero-fade]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, stagger: 0.1 },
        );
        return;
      }

      // Variable-font weight swells as the headline reveals.
      if (headlineRef.current) {
        gsap.fromTo(
          headlineRef.current,
          { fontVariationSettings: '"wght" 300' },
          {
            fontVariationSettings: '"wght" 620',
            duration: 1.8,
            delay: 0.35,
            ease: "power3.out",
          },
        );
      }

      gsap.fromTo(
        "[data-hero-fade]",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.75,
        },
      );

      // Scroll cue fades out over the first 200px of scroll.
      if (cueRef.current) {
        gsap.to(cueRef.current, {
          autoAlpha: 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=240",
            scrub: 0.4,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Layered background: gradient wash + interactive particles + vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 50% 10%, var(--color-navy) 0%, var(--color-bg-primary) 60%)",
        }}
      />
      <HeroBackground opacity={0.5} />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg-primary))",
        }}
      />

      <div className="container-x relative z-10 pb-28 pt-40">
        <p data-hero-fade className="eyebrow-accent mb-6 opacity-0">
          Izinix — AI Automation Agency
        </p>

        <h1 ref={headlineRef} className="h-display max-w-5xl">
          <AnimatedText trigger="load" delay={0.35} stagger={0.09}>
            We automate what slows you down.
          </AnimatedText>
        </h1>

        <p
          data-hero-fade
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-secondary opacity-0 sm:text-lg"
        >
          Web development, UI/UX design, content, and AI automation — four
          disciplines, one team, building systems that run your business while
          you grow it.
        </p>

        <div data-hero-fade className="mt-8 flex flex-wrap gap-3 opacity-0">
          {pillars.map((pillar) => (
            <span
              key={pillar}
              className="glass glass--chip px-4 py-2 font-mono text-xs uppercase tracking-eyebrow text-ink-secondary"
            >
              {pillar}
            </span>
          ))}
        </div>

        <div data-hero-fade className="mt-12 flex flex-wrap items-center gap-4 opacity-0">
          <MagneticButton href="/contact" variant="primary" size="lg">
            Start a Project
            <Icon name="arrow-right" size={18} />
          </MagneticButton>
          <MagneticButton href="/work" variant="ghost" size="lg">
            See Our Work
          </MagneticButton>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={cueRef}
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-tertiary">
          Scroll
        </span>
        <span className="block h-12 w-px overflow-hidden bg-white/10">
          <span className="scroll-cue-line block h-full w-full bg-accent" />
        </span>
      </div>
    </section>
  );
}
