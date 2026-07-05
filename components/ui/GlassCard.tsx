"use client";

/**
 * Reusable glass surface (see the .glass system in globals.css).
 * On large cards the specular highlight follows the cursor, so the glass
 * appears to tilt toward the light — disabled for touch/reduced motion.
 */
import { useCallback, useRef, type ReactNode, type MouseEvent } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  elevation?: "nav" | "chip" | "card" | "panel";
  hover?: boolean;
  /** Track the cursor with the specular highlight (larger cards only). */
  specular?: boolean;
};

export default function GlassCard({
  children,
  className = "",
  elevation = "card",
  hover = false,
  specular = false,
}: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (!specular || prefersReducedMotion()) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spec-x", `${x}%`);
      el.style.setProperty("--spec-y", `${y}%`);
    },
    [specular],
  );

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--spec-x", "15%");
    el.style.setProperty("--spec-y", "0%");
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={specular ? onMouseMove : undefined}
      onMouseLeave={specular ? onMouseLeave : undefined}
      className={`glass glass--${elevation} ${hover ? "glass-hover" : ""} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
