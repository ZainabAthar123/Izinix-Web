"use client";

/**
 * Masked text reveal (SplitText-style, dependency-free).
 * Splits a string into words (or characters), wraps each segment in an
 * overflow-hidden mask, and slides the segments up into view — on mount
 * ("load") or when scrolled into view ("scroll").
 *
 * Falls back to a plain fade when the user prefers reduced motion.
 */
import { Fragment, useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

type AnimatedTextProps = {
  children: string;
  as?: ElementType;
  className?: string;
  mode?: "words" | "chars";
  trigger?: "load" | "scroll";
  delay?: number;
  stagger?: number;
  duration?: number;
};

export default function AnimatedText({
  children,
  as = "span",
  className,
  mode = "words",
  trigger = "scroll",
  delay = 0,
  stagger = 0.07,
  duration = 1.1,
}: AnimatedTextProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const segments = root.querySelectorAll<HTMLElement>("[data-seg]");
    if (!segments.length) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        gsap.fromTo(
          root,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.6,
            delay,
            scrollTrigger:
              trigger === "scroll"
                ? { trigger: root, start: "top 88%", once: true }
                : undefined,
          },
        );
        return;
      }

      gsap.fromTo(
        segments,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger:
            trigger === "scroll"
              ? { trigger: root, start: "top 88%", once: true }
              : undefined,
        },
      );
    }, root);

    return () => ctx.revert();
  }, [children, delay, duration, stagger, trigger]);

  const words = children.split(" ");

  // Loosely-typed polymorphic tag — the ref works for any host element.
  const Tag = as as "span";

  return (
    <Tag
      ref={rootRef as React.Ref<HTMLSpanElement>}
      className={className}
      aria-label={children}
    >
      {words.map((word, wi) => (
      <Fragment key={`${word}-${wi}`}>
        <span
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em] whitespace-nowrap"
        >
          {mode === "words" ? (
            <span data-seg className="inline-block will-change-transform">
              {word}
            </span>
          ) : (
            word.split("").map((char, ci) => (
              <span
                key={ci}
                data-seg
                className="inline-block will-change-transform"
              >
                {char}
              </span>
            ))
          )}
        </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
