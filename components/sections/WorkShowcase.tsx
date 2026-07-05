"use client";

/**
 * Use Case page body: scoped hero with glass filter pills, a stack of
 * pinned Before/After scenarios, and a closing CTA. Changing the filter
 * remounts the scenario stack (key={filter}) so ScrollTriggers rebuild
 * cleanly for the new layout.
 */
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import AnimatedText from "@/components/ui/AnimatedText";
import BeforeAfterScenario from "@/components/sections/BeforeAfterScenario";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { scenarioFilters, scenarios, type ScenarioTag } from "@/lib/data";

const HeroBackground = dynamic(
  () => import("@/components/three/HeroBackground"),
  { ssr: false },
);

type Filter = "All" | ScenarioTag;

export default function WorkShowcase() {
  const [filter, setFilter] = useState<Filter>("All");

  const visibleScenarios =
    filter === "All"
      ? scenarios
      : scenarios.filter((scenario) => scenario.tag === filter);

  // Pin positions shift when the list changes — re-measure everything.
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [filter]);

  return (
    <>
      {/* Scoped hero */}
      <section className="relative overflow-hidden pb-16 pt-44 sm:pb-24">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, var(--color-navy) 0%, var(--color-bg-primary) 65%)",
          }}
        />
        <HeroBackground opacity={0.35} density={0.7} />

        <div className="container-x relative z-10">
          <p className="eyebrow-accent mb-6">Use cases</p>
          <h1 className="h-display max-w-4xl !text-[clamp(3.2rem,4vw+1.8rem,6.5rem)]">
            <AnimatedText trigger="load" delay={0.2}>
              See the systems we&rsquo;ve built.
            </AnimatedText>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg">
            Real operational patterns, shown as before and after. Scroll each
            scenario to drag the transformation into view.
          </p>

          {/* Filter pills */}
          <div
            role="group"
            aria-label="Filter scenarios by service"
            className="mt-10 flex flex-wrap gap-3"
          >
            {scenarioFilters.map((item) => {
              const active = filter === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item)}
                  className={`glass glass--chip glass-press px-5 py-2.5 font-mono text-xs uppercase tracking-eyebrow transition-colors duration-glass ease-glass ${
                    active
                      ? "!bg-accent/90 text-[#0b0f17] shadow-[0_0_32px_rgba(255,90,31,0.35)]"
                      : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          <p className="mt-8 font-mono text-[10px] tracking-eyebrow text-ink-tertiary">
            ILLUSTRATIVE_SCENARIOS // SWAP_WITH_CLIENT_DATA_IN lib/data.ts
          </p>
        </div>
      </section>

      {/* Scenario stack — remounts per filter so pins rebuild */}
      <section key={filter} className="container-x space-y-24 pb-32 sm:space-y-32">
        {visibleScenarios.map((scenario) => (
          <BeforeAfterScenario key={scenario.number} {...scenario} />
        ))}
        {visibleScenarios.length === 0 ? (
          <p className="py-20 text-center text-ink-secondary">
            No scenarios for this filter yet — add one in lib/data.ts.
          </p>
        ) : null}
      </section>

      <ClosingCTA
        eyebrow="Your operation next"
        title="Ready to see this running your business?"
        subtitle="Bring us the workflow that eats your team's week. We'll show you the after."
        buttonLabel="Book an intro call"
        href="/contact"
      />
    </>
  );
}
