"use client";

/**
 * <BeforeAfterScenario /> — the core Use Case pattern.
 *
 * A glass "device frame" (browser-chrome dots + mono system label) split
 * into BEFORE (dim, manual pain) and AFTER (warm, automated outcome).
 *
 * Desktop + motion allowed:
 *   the card pins while an orange scan line wipes left→right across the
 *   AFTER panel, revealing its content via clip-path as the user scrolls
 *   (scrubbed) — the user literally drags the transformation into view.
 * Mobile / reduced motion:
 *   panels stack and fade in sequentially; no pinning.
 *
 * Add scenarios in lib/data.ts — this component is fully data-driven.
 */
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Icon } from "@/components/ui/icons";
import type { Scenario } from "@/lib/data";

export default function BeforeAfterScenario({
  number,
  monoLabel,
  beforeTitle,
  beforePoints,
  afterTitle,
  afterPoints,
  outcome,
  tag,
}: Scenario) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const afterContentRef = useRef<HTMLDivElement>(null);

  const paddedNumber = String(number).padStart(2, "0");

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);

    // Full treatment: pin + scrubbed scan-line reveal.
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const scan = scanRef.current;
        const afterContent = afterContentRef.current;
        if (!scan || !afterContent) return;

        gsap.set(afterContent, { clipPath: "inset(0% 100% 0% 0%)" });
        gsap.set(scan, { left: "50%", autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top+=110",
            end: "+=120%",
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        tl.fromTo(
          "[data-before-item]",
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 0.9,
            y: 0,
            stagger: 0.06,
            duration: 0.4,
            ease: "power2.out",
          },
        )
          .to(scan, { autoAlpha: 1, duration: 0.06 })
          .to(
            scan,
            { left: "100%", duration: 1, ease: "power2.inOut" },
            "<",
          )
          .to(
            afterContent,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1,
              ease: "power2.inOut",
            },
            "<",
          )
          // brightness pop as the AFTER side lands
          .fromTo(
            afterContent,
            { filter: "brightness(1.3) saturate(1.15)" },
            { filter: "brightness(1) saturate(1)", duration: 0.35 },
            "-=0.25",
          )
          .to(scan, { autoAlpha: 0, duration: 0.1 }, "-=0.2");
      },
    );

    // Light treatment: staggered fades, no pin.
    mm.add(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
      () => {
        gsap.fromTo(
          "[data-before-item]",
          { autoAlpha: 0 },
          {
            autoAlpha: 0.9,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          },
        );
        gsap.fromTo(
          "[data-after-item]",
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.08,
            delay: 0.25,
            scrollTrigger: { trigger: root, start: "top 75%", once: true },
          },
        );
      },
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={rootRef} className="scenario">
      <article
        className="glass glass--panel relative overflow-hidden"
        aria-label={`Scenario ${paddedNumber}: ${tag} — before and after`}
      >
        {/* Device-frame chrome */}
        <header className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
          </div>
          <span className="font-mono text-[10px] tracking-eyebrow text-ink-tertiary sm:text-xs">
            {monoLabel}
          </span>
        </header>

        <div className="relative grid md:grid-cols-2">
          {/* Hairline divider between panels */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 hidden w-px bg-line md:block"
          />

          {/* Scan line (desktop reveal) */}
          <div
            ref={scanRef}
            aria-hidden="true"
            className="absolute inset-y-0 z-10 hidden w-px md:block"
            style={{
              left: "50%",
              opacity: 0,
              background:
                "linear-gradient(to bottom, transparent, var(--color-accent), transparent)",
              boxShadow: "0 0 24px 2px rgba(255, 90, 31, 0.55)",
            }}
          />

          {/* BEFORE — dim, manual */}
          <section
            className="relative p-6 sm:p-10 lg:p-12"
            style={{ background: "rgba(0, 0, 0, 0.25)" }}
            aria-label="Before"
          >
            <p
              data-before-item
              className="font-mono text-[10px] uppercase tracking-eyebrow text-ink-tertiary sm:text-xs"
            >
              Scenario {paddedNumber} / Before
            </p>
            <h3
              data-before-item
              className="mt-5 max-w-md font-display text-2xl font-light leading-snug text-ink-secondary sm:text-3xl"
            >
              {beforeTitle}
            </h3>
            <ul className="mt-8 space-y-4">
              {beforePoints.map((point) => (
                <li
                  key={point}
                  data-before-item
                  className="flex items-start gap-3 text-sm font-light italic leading-relaxed text-ink-secondary/80"
                >
                  <Icon
                    name="warn"
                    size={16}
                    className="mt-0.5 shrink-0 text-ink-tertiary"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          {/* AFTER — warm, automated */}
          <section
            className="relative p-6 sm:p-10 lg:p-12"
            style={{
              background:
                "linear-gradient(160deg, rgba(26, 44, 74, 0.35), rgba(255, 90, 31, 0.05))",
            }}
            aria-label="After"
          >
            <div ref={afterContentRef}>
              <p
                data-after-item
                className="font-mono text-[10px] uppercase tracking-eyebrow text-accent sm:text-xs"
              >
                Scenario {paddedNumber} / After
              </p>
              <h3
                data-after-item
                className="mt-5 max-w-md font-serif text-2xl italic leading-snug text-ink sm:text-3xl"
              >
                {afterTitle}
              </h3>
              <ul className="mt-8 space-y-4">
                {afterPoints.map((point) => (
                  <li
                    key={point}
                    data-after-item
                    className="flex items-start gap-3 text-sm leading-relaxed text-ink"
                  >
                    <Icon
                      name="check"
                      size={16}
                      className="mt-0.5 shrink-0 text-accent"
                    />
                    {point}
                  </li>
                ))}
              </ul>

              <hr data-after-item className="my-8 border-line" />

              <p
                data-after-item
                className="font-mono text-[10px] uppercase tracking-eyebrow text-accent sm:text-xs"
              >
                Outcome
              </p>
              <p
                data-after-item
                className="mt-3 font-display text-lg font-semibold text-ink sm:text-xl"
              >
                {outcome}
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
