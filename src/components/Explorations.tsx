import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Exploration {
  title: string;
  image: string;
  rotate: number;
}

const COLUMN_ONE: Exploration[] = [
  {
    title: "Chromatic study",
    image: "https://picsum.photos/seed/exploration-1/600/600",
    rotate: -3,
  },
  {
    title: "Grain texture",
    image: "https://picsum.photos/seed/exploration-2/600/600",
    rotate: 2,
  },
  {
    title: "Type experiment",
    image: "https://picsum.photos/seed/exploration-3/600/600",
    rotate: -2,
  },
];

const COLUMN_TWO: Exploration[] = [
  {
    title: "Light study",
    image: "https://picsum.photos/seed/exploration-4/600/600",
    rotate: 3,
  },
  {
    title: "Form iteration",
    image: "https://picsum.photos/seed/exploration-5/600/600",
    rotate: -2,
  },
  {
    title: "Color field",
    image: "https://picsum.photos/seed/exploration-6/600/600",
    rotate: 2,
  },
];

export default function Explorations() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const colOneRef = useRef<HTMLDivElement | null>(null);
  const colTwoRef = useRef<HTMLDivElement | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: contentRef.current,
        pinSpacing: false,
      });

      gsap.to(colOneRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      gsap.to(colTwoRef.current, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
      <div
        ref={contentRef}
        className="relative z-10 h-screen w-full flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">
            Explorations
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mb-4">
          Visual <span className="italic">playground</span>
        </h2>
        <p className="text-sm md:text-base text-muted max-w-md mb-8">
          Personal experiments in color, form, and motion — made for the joy
          of making.
        </p>
        <a
          href="https://dribbble.com"
          target="_blank"
          rel="noreferrer"
          className="group relative rounded-full"
        >
          <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-2 rounded-full border-2 border-stroke group-hover:border-transparent bg-bg text-sm px-6 py-3 text-text-primary transition-colors duration-300">
            View on Dribbble <span aria-hidden="true">↗</span>
          </span>
        </a>
      </div>

      <div className="absolute inset-0 z-20 flex justify-center pt-[15vh] pointer-events-none">
        <div className="grid grid-cols-2 gap-12 md:gap-40 max-w-[1400px] w-full px-6">
          <div ref={colOneRef} className="flex flex-col gap-10 items-end">
            {COLUMN_ONE.map((item) => (
              <button
                key={item.title}
                onClick={() => setLightbox(item.image)}
                style={{ transform: `rotate(${item.rotate}deg)` }}
                className="pointer-events-auto w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface transition-transform duration-300 hover:scale-105 hover:rotate-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
          <div ref={colTwoRef} className="flex flex-col gap-10 items-start">
            {COLUMN_TWO.map((item) => (
              <button
                key={item.title}
                onClick={() => setLightbox(item.image)}
                style={{ transform: `rotate(${item.rotate}deg)` }}
                className="pointer-events-auto w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface transition-transform duration-300 hover:scale-105 hover:rotate-0"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 cursor-zoom-out"
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full rounded-2xl border border-stroke"
          />
        </div>
      )}
    </section>
  );
}
