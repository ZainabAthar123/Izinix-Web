"use client";

/**
 * Five services as an index-numbered vertical list of glass rows.
 * Desktop: hovering a row traces an orange line across its top edge and
 * unfolds the detail text (pure CSS grid-rows trick — no JS measuring).
 * Mobile: details are always visible.
 */
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import { TransitionLink } from "@/components/layout/PageTransition";
import { Icon } from "@/components/ui/icons";
import { services } from "@/lib/data";

export default function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-service-row]");
      gsap.fromTo(
        rows,
        prefersReducedMotion()
          ? { autoAlpha: 0 }
          : { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: "top 70%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-28 sm:py-36">
      <div className="container-x">
        <p className="eyebrow-accent mb-4">What we do</p>
        <h2 className="h-section max-w-3xl">
          <AnimatedText stagger={0.05}>
            Five disciplines. One operating system for your business.
          </AnimatedText>
        </h2>

        <ul className="mt-16 space-y-4">
          {services.map((service) => (
            <li key={service.index}>
              <div
                data-service-row
                className="group glass glass--card glass-hover relative overflow-hidden p-6 opacity-0 sm:p-8"
              >
                {/* Orange accent line traces the top edge on hover */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-accent via-accent-bright to-transparent transition-transform duration-glass ease-glass group-hover:scale-x-100"
                />

                <div className="flex items-start gap-5 sm:items-center sm:gap-10">
                  <span className="font-mono text-sm text-ink-tertiary transition-colors duration-glass group-hover:text-accent sm:text-base">
                    {service.index}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                      <h3 className="font-display text-2xl font-semibold tracking-tightest text-ink sm:text-4xl">
                        {service.title}
                      </h3>
                      <p className="text-sm text-ink-secondary">
                        {service.blurb}
                      </p>
                    </div>

                    {/* Detail unfolds on hover (always open on mobile) */}
                    <div className="grid grid-rows-[1fr] transition-[grid-template-rows] duration-glass ease-glass md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pt-4 text-sm leading-relaxed text-ink-secondary">
                          {service.detail}
                        </p>
                        <TransitionLink
                          href="/contact"
                          className="link-underline mt-4 inline-flex items-center gap-2 pb-1 font-mono text-xs uppercase tracking-eyebrow text-accent"
                        >
                          Learn more
                          <Icon name="arrow-right" size={14} />
                        </TransitionLink>
                      </div>
                    </div>
                  </div>

                  <span className="glass glass--chip flex h-12 w-12 shrink-0 items-center justify-center text-accent">
                    <Icon name={service.icon} size={22} />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
