"use client";

/**
 * Selected works — a grid of project cards with generated gradient
 * cover art, tilt-on-mouse-move (max ~6°), image scale on hover, and a
 * "View" cursor label. Clicking goes to /work.
 */
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import AnimatedText from "@/components/ui/AnimatedText";
import { TransitionLink } from "@/components/layout/PageTransition";
import { Icon } from "@/components/ui/icons";
import { projects, type Project } from "@/lib/data";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rotX = gsap.quickTo(card, "rotationX", {
      duration: 0.6,
      ease: "power3.out",
    });
    const rotY = gsap.quickTo(card, "rotationY", {
      duration: 0.6,
      ease: "power3.out",
    });
    gsap.set(card, { transformPerspective: 900 });

    const onMove = (event: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      rotX(py * -7);
      rotY(px * 7);
    };
    const onLeave = () => {
      rotX(0);
      rotY(0);
    };

    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <TransitionLink
      href="/work"
      data-cursor="View"
      aria-label={`${project.name} — ${project.tag}. ${project.summary}`}
      className="block"
    >
      <div
        ref={cardRef}
        data-project-card
        className="glass glass--card glass-hover tilt-card group relative overflow-hidden !rounded-3xl p-0 opacity-0 will-change-transform"
      >
        {/* Generated cover art (placeholder for a real image/video) */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 transition-transform duration-700 ease-glass group-hover:scale-[1.07]"
            style={{
              background: `
                radial-gradient(70% 90% at 20% 15%, ${project.hueA} 0%, transparent 70%),
                radial-gradient(55% 65% at 85% 90%, ${project.hueB}44 0%, transparent 70%),
                linear-gradient(${project.angle}deg, var(--color-bg-elevated), var(--color-bg-primary))
              `,
            }}
          >
            {/* Fine grid lines for a technical feel */}
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)",
                backgroundSize: "56px 56px",
              }}
            />
            <span className="absolute right-5 top-4 font-mono text-[10px] tracking-eyebrow text-white/30">
              PLACEHOLDER_MEDIA // 0{index + 1}
            </span>
            <span className="absolute bottom-2 left-4 font-display text-[7rem] font-bold leading-none text-white/[0.06]">
              0{index + 1}
            </span>
          </div>
          {/* Dark gradient overlay for label legibility */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(5,7,10,0.85) 0%, transparent 45%)",
            }}
          />
          {/* Glass label chip */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3">
            <div className="glass glass--chip flex items-center gap-3 px-4 py-2">
              <span className="font-display text-sm font-semibold text-ink">
                {project.name}
              </span>
              <span className="h-3 w-px bg-white/20" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-eyebrow text-accent">
                {project.tag}
              </span>
            </div>
            <span className="glass glass--chip flex h-9 w-9 shrink-0 items-center justify-center text-ink-secondary transition-colors duration-glass group-hover:text-accent">
              <Icon name="arrow-up-right" size={16} />
            </span>
          </div>
        </div>
        <p className="px-5 py-4 text-sm text-ink-secondary">
          {project.summary}
        </p>
      </div>
    </TransitionLink>
  );
}

export default function Showcase() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-project-card]",
        prefersReducedMotion() ? { autoAlpha: 0 } : { autoAlpha: 0, y: 48 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root, start: "top 72%", once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative py-28 sm:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow-accent mb-4">Selected work</p>
            <h2 className="h-section max-w-2xl">
              <AnimatedText stagger={0.05}>
                Systems already out there, running.
              </AnimatedText>
            </h2>
          </div>
          <TransitionLink
            href="/work"
            className="link-underline pb-1 font-mono text-xs uppercase tracking-eyebrow text-ink-secondary hover:text-ink"
          >
            All use cases →
          </TransitionLink>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
