"use client";

/**
 * Custom cursor: a small orange dot with a trailing ring.
 * Over any element carrying `data-cursor="View" | "Drag" | "Click" | …`
 * the ring morphs into a labelled pill; over plain links/buttons it
 * simply grows. Disabled on touch devices and under reduced motion,
 * and hidden from assistive tech.
 */
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    document.body.classList.add("has-custom-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.42, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.42, ease: "power3.out" });

    let visible = false;

    const onMove = (event: MouseEvent) => {
      if (!visible) {
        visible = true;
        // Jump straight to the pointer so the ring doesn't fly in.
        gsap.set([dot, ring], { x: event.clientX, y: event.clientY });
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.25 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const setLabel = (text: string | null) => {
      if (text) {
        label.textContent = text;
        gsap.to(ring, {
          width: 76,
          height: 76,
          backgroundColor: "rgba(255, 90, 31, 0.92)",
          borderColor: "rgba(255, 90, 31, 0)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: 1, duration: 0.25, delay: 0.08 });
        gsap.to(dot, { autoAlpha: 0, duration: 0.2 });
      } else {
        gsap.to(ring, {
          width: 36,
          height: 36,
          backgroundColor: "rgba(255, 90, 31, 0)",
          borderColor: "rgba(255, 122, 61, 0.55)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(label, { autoAlpha: 0, duration: 0.15 });
        gsap.to(dot, { autoAlpha: 1, duration: 0.2 });
      }
    };

    const grow = (on: boolean) => {
      gsap.to(ring, {
        scale: on ? 1.6 : 1,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || !(target instanceof Element)) return;
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        setLabel(labelled.dataset.cursor || "View");
        return;
      }
      setLabel(null);
      grow(!!target.closest("a, button, [role='button'], input, select, textarea, label"));
    };

    const onLeaveWindow = () => {
      visible = false;
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-cursor">
      <div
        ref={dotRef}
        className="absolute -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent opacity-0"
      />
      <div
        ref={ringRef}
        className="absolute flex items-center justify-center rounded-full border opacity-0"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderColor: "rgba(255, 122, 61, 0.55)",
        }}
      >
        <span
          ref={labelRef}
          className="font-display text-[11px] font-semibold uppercase tracking-widest text-[#0b0f17] opacity-0"
        />
      </div>
    </div>
  );
}
