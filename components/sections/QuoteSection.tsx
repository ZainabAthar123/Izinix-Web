"use client";

/**
 * Large centered serif quote with a masked, scroll-triggered reveal.
 * Two visual variants so the component can appear twice on the homepage
 * without feeling duplicated:
 *  - "a": black base, faint marquee running behind, floating orange blobs
 *  - "b": inverted navy gradient panel, denser glow, no marquee
 */
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import Marquee from "@/components/ui/Marquee";
import type { Quote } from "@/lib/data";

type QuoteSectionProps = Quote & {
  variant?: "a" | "b";
};

export default function QuoteSection({
  text,
  attribution,
  role,
  variant = "a",
}: QuoteSectionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      // Floating accent blobs drift on parallax as the section scrolls.
      gsap.utils.toArray<HTMLElement>("[data-blob]").forEach((blob, index) => {
        gsap.to(blob, {
          yPercent: index % 2 === 0 ? -28 : 22,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      gsap.fromTo(
        "[data-quote-meta]",
        { autoAlpha: 0, y: 16 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 65%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  const isInverted = variant === "b";

  return (
    <section
      ref={rootRef}
      className={`relative overflow-hidden py-28 sm:py-40 ${
        isInverted ? "bg-bg-secondary" : ""
      }`}
      style={
        isInverted
          ? {
              background:
                "radial-gradient(70% 90% at 50% 100%, var(--color-navy) 0%, var(--color-bg-secondary) 70%)",
            }
          : undefined
      }
    >
      {/* Background treatment */}
      {variant === "a" ? (
        <Marquee
          text="AUTOMATE · DESIGN · BUILD · SCALE"
          className="absolute top-1/2 w-full -translate-y-1/2 font-display text-[9rem] font-bold leading-none text-white/[0.025] sm:text-[13rem]"
          duration={60}
        />
      ) : null}

      <div
        data-blob
        aria-hidden="true"
        className={`pointer-events-none absolute h-72 w-72 rounded-full blur-3xl ${
          isInverted ? "-right-20 top-10" : "-left-24 top-16"
        }`}
        style={{ background: "radial-gradient(closest-side, rgba(255,90,31,0.16), transparent)" }}
      />
      <div
        data-blob
        aria-hidden="true"
        className={`pointer-events-none absolute h-96 w-96 rounded-full blur-3xl ${
          isInverted ? "-left-32 bottom-0" : "-right-28 bottom-8"
        }`}
        style={{ background: "radial-gradient(closest-side, rgba(26,44,74,0.65), transparent)" }}
      />

      <figure className="container-x relative z-10 mx-auto max-w-4xl text-center">
        <span
          aria-hidden="true"
          className="mb-6 block font-serif text-6xl italic leading-none text-accent/40 sm:text-7xl"
        >
          &ldquo;
        </span>
        <blockquote>
          <AnimatedText
            as="p"
            className="font-serif text-2xl italic leading-snug text-ink sm:text-3xl lg:text-4xl"
            stagger={0.035}
          >
            {text}
          </AnimatedText>
        </blockquote>
        <figcaption data-quote-meta className="mt-10 opacity-0">
          <span className="font-mono text-xs uppercase tracking-eyebrow text-ink-secondary">
            {attribution}
          </span>
          <span className="mx-3 text-accent" aria-hidden="true">
            —
          </span>
          <span className="font-mono text-xs uppercase tracking-eyebrow text-ink-tertiary">
            {role}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
