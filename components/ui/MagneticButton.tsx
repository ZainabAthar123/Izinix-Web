"use client";

/**
 * Magnetic CTA. The whole button drifts toward the cursor inside its
 * bounds (gsap.quickTo lerp), the label drifts a little further, and both
 * spring back on leave. Renders a real <button> or an <a> (with the page
 * transition) depending on whether `href` is given.
 *
 * Magnetism is disabled on touch devices and under reduced motion —
 * the element remains a perfectly ordinary button.
 */
import {
  useEffect,
  useRef,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { useTransitionNavigate } from "@/components/layout/PageTransition";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  "data-cursor"?: string;
};

export default function MagneticButton({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  ...rest
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const navigate = useTransitionNavigate();

  useEffect(() => {
    const wrap = wrapRef.current;
    const label = labelRef.current;
    if (!wrap || !label) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(wrap, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(wrap, "y", { duration: 0.4, ease: "power3.out" });
    const lxTo = gsap.quickTo(label, "x", { duration: 0.4, ease: "power3.out" });
    const lyTo = gsap.quickTo(label, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (event: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * 0.3);
      yTo(relY * 0.3);
      lxTo(relX * 0.14);
      lyTo(relY * 0.14);
    };

    const onLeave = () => {
      gsap.to([wrap, label], {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.4)",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);
    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const sizeClass =
    size === "lg" ? "!px-10 !py-5 !text-base" : "";
  const variantClass =
    variant === "primary"
      ? "btn btn-primary"
      : "btn btn-ghost glass glass--chip glass-hover glass-press";
  const classes = `${variantClass} ${sizeClass} ${className}`.trim();

  const handleLinkClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onClick?.();
    if (href) navigate(href);
  };

  return (
    <div ref={wrapRef} className="inline-block will-change-transform">
      {href ? (
        <Link href={href} onClick={handleLinkClick} className={classes} {...rest}>
          <span ref={labelRef} className="inline-flex items-center gap-2 will-change-transform">
            {children}
          </span>
        </Link>
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={classes}
          {...rest}
        >
          <span ref={labelRef} className="inline-flex items-center gap-2 will-change-transform">
            {children}
          </span>
        </button>
      )}
    </div>
  );
}
