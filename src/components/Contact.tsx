import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import HlsBackgroundVideo from "./HlsBackgroundVideo";

const SOCIALS = [
  { label: "Twitter", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "GitHub", href: "https://github.com" },
];

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <HlsBackgroundVideo flipped />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        <div className="overflow-hidden whitespace-nowrap py-8 md:py-12 border-y border-stroke/50">
          <div ref={marqueeRef} className="inline-flex">
            {Array.from({ length: 2 }).map((_, dupeIndex) => (
              <span
                key={dupeIndex}
                className="text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/90"
              >
                {"Building the future • ".repeat(10)}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24 flex flex-col items-center text-center">
          <p className="text-xs text-muted uppercase tracking-[0.3em] mb-6">
            Get in touch
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary mb-10 max-w-2xl">
            Let&apos;s build something worth remembering.
          </h2>
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative rounded-full"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 rounded-full bg-text-primary text-bg text-sm px-8 py-4 group-hover:bg-bg group-hover:text-text-primary transition-colors duration-300">
              hello@michaelsmith.com <span aria-hidden="true">↗</span>
            </span>
          </a>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-stroke/50">
          <div className="flex items-center gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted hover:text-text-primary transition-colors duration-200"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-sm text-muted">Available for projects</span>
          </div>
        </div>
      </div>
    </section>
  );
}
