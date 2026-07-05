"use client";

/**
 * Closing CTA: oversized statement, glow-pulsing magnetic button, and a
 * field of orange particles drifting upward (pure CSS, hidden under
 * reduced motion).
 */
import { useMemo } from "react";
import AnimatedText from "@/components/ui/AnimatedText";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/icons";

type ClosingCTAProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  buttonLabel: string;
  href: string;
};

export default function ClosingCTA({
  eyebrow = "Next step",
  title,
  subtitle,
  buttonLabel,
  href,
}: ClosingCTAProps) {
  // Deterministic pseudo-random particle layout (stable across renders).
  const particleParams = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        left: `${(i * 67) % 100}%`,
        size: 2 + ((i * 37) % 4),
        delay: `${(i * 0.9) % 8}s`,
        duration: `${7 + ((i * 13) % 6)}s`,
      })),
    [],
  );

  return (
    <section className="relative overflow-hidden py-32 sm:py-44">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 60%, var(--color-navy) 0%, transparent 70%)",
        }}
      />

      {/* Rising particles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {particleParams.map((p, i) => (
          <span
            key={i}
            className="particle"
            style={
              {
                left: p.left,
                width: p.size,
                height: p.size,
                "--particle-delay": p.delay,
                "--particle-duration": p.duration,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="container-x relative z-10 text-center">
        <p className="eyebrow-accent mb-6">{eyebrow}</p>
        <h2 className="h-section mx-auto max-w-4xl">
          <AnimatedText stagger={0.05}>{title}</AnimatedText>
        </h2>
        {subtitle ? (
          <p className="mx-auto mt-6 max-w-xl text-base text-ink-secondary">
            {subtitle}
          </p>
        ) : null}
        <div className="mt-12 inline-block animate-glow-pulse rounded-full">
          <MagneticButton href={href} variant="primary" size="lg">
            {buttonLabel}
            <Icon name="arrow-right" size={18} />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
