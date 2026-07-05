"use client";

/**
 * "How we work" — vertical stepper. A rail on the left fills with an
 * orange gradient as the user scrolls (scrubbed), each numbered glass
 * node lights up as the fill passes it.
 */
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import { Icon } from "@/components/ui/icons";
import { processSteps } from "@/lib/data";

export default function Process() {
  const rootRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-step]");

      if (prefersReducedMotion()) {
        gsap.fromTo(
          steps,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: { trigger: root, start: "top 70%", once: true },
          },
        );
        if (fillRef.current) gsap.set(fillRef.current, { scaleY: 1 });
        steps.forEach((step) => step.classList.add("is-active"));
        return;
      }

      // Rail fill scrubs with scroll.
      if (fillRef.current) {
        gsap.fromTo(
          fillRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-timeline]",
              start: "top 65%",
              end: "bottom 55%",
              scrub: 0.5,
            },
          },
        );
      }

      steps.forEach((step) => {
        gsap.fromTo(
          step,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: step, start: "top 78%", once: true },
          },
        );
        // Node lights up while the rail fill passes it.
        ScrollTrigger.create({
          trigger: step,
          start: "top 60%",
          end: "bottom -20%",
          toggleClass: { targets: step, className: "is-active" },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden py-28 sm:py-36"
      style={{
        background:
          "radial-gradient(60% 50% at 80% 0%, var(--color-navy) 0%, transparent 60%)",
      }}
    >
      <div className="container-x">
        <p className="eyebrow-accent mb-4">How we work</p>
        <h2 className="h-section max-w-3xl">
          <AnimatedText stagger={0.05}>
            A straight line from bottleneck to system.
          </AnimatedText>
        </h2>

        <div data-timeline className="relative mt-20 pl-10 sm:pl-16">
          {/* Rail + animated orange fill */}
          <div
            aria-hidden="true"
            className="absolute bottom-6 left-[19px] top-6 w-px bg-white/10 sm:left-[27px]"
          >
            <div
              ref={fillRef}
              className="h-full w-full origin-top bg-gradient-to-b from-accent via-accent-bright to-accent-dim"
              style={{ transform: "scaleY(0)" }}
            />
          </div>

          <ol className="space-y-16">
            {processSteps.map((step) => (
              <li key={step.index} data-step className="relative opacity-0">
                {/* Numbered node sitting on the rail */}
                <span
                  data-node
                  className="glass glass--chip absolute -left-10 top-0 flex h-10 w-10 items-center justify-center border border-line font-mono text-xs text-ink-tertiary transition-all duration-glass ease-glass sm:-left-16 sm:h-14 sm:w-14 sm:text-sm"
                >
                  {step.index}
                </span>

                <div className="max-w-2xl pl-4 sm:pl-6">
                  <div className="flex items-center gap-4">
                    <h3 className="font-display text-2xl font-semibold tracking-tightest text-ink sm:text-3xl">
                      {step.title}
                    </h3>
                    <Icon
                      name={step.icon}
                      size={20}
                      data-step-icon
                      className="text-ink-tertiary transition-colors duration-glass"
                    />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink-secondary sm:text-base">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
