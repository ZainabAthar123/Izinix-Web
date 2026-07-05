"use client";

/**
 * Route-change wipe: a dark navy panel sweeps up over the page, the logo
 * flashes, the route swaps underneath, and the panel sweeps away.
 *
 * Exposes:
 *  - <PageTransitionProvider>  (mount once in the root layout)
 *  - useTransitionNavigate()   (imperative navigation with the wipe)
 *  - <TransitionLink>          (drop-in replacement for next/link)
 */
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { scrollState } from "@/lib/scroll";

type NavigateFn = (href: string) => void;

const TransitionContext = createContext<NavigateFn>(() => {});

export function useTransitionNavigate(): NavigateFn {
  return useContext(TransitionContext);
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLSpanElement>(null);
  const pendingRef = useRef(false);
  const animatingRef = useRef(false);

  const navigate = useCallback<NavigateFn>(
    (href) => {
      if (animatingRef.current) return;
      if (href === window.location.pathname) return;

      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      const logo = logoRef.current;
      if (!overlay || !logo) {
        router.push(href);
        return;
      }

      animatingRef.current = true;
      pendingRef.current = true;

      gsap
        .timeline()
        .set(overlay, { display: "flex", pointerEvents: "auto" })
        .fromTo(
          overlay,
          { yPercent: 101 },
          { yPercent: 0, duration: 0.55, ease: "power3.inOut" },
        )
        .fromTo(
          logo,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.35,
            ease: "power3.out",
            onComplete: () => router.push(href),
          },
          "-=0.15",
        );
    },
    [router],
  );

  // When the new route has mounted, reset scroll and sweep the panel away.
  useEffect(() => {
    if (!pendingRef.current) return;
    pendingRef.current = false;

    const overlay = overlayRef.current;
    const logo = logoRef.current;
    if (!overlay || !logo) {
      animatingRef.current = false;
      return;
    }

    if (scrollState.lenis) {
      scrollState.lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }

    gsap
      .timeline({
        delay: 0.15,
        onComplete: () => {
          gsap.set(overlay, { display: "none", yPercent: 101 });
          animatingRef.current = false;
          ScrollTrigger.refresh();
        },
      })
      .to(logo, { autoAlpha: 0, y: -14, duration: 0.3, ease: "power2.in" })
      .to(
        overlay,
        { yPercent: -101, duration: 0.65, ease: "power3.inOut" },
        "-=0.1",
      );
  }, [pathname]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-transition hidden items-center justify-center bg-bg-secondary"
        style={{ transform: "translateY(101%)" }}
      >
        <span
          ref={logoRef}
          className="font-display text-2xl font-semibold tracking-[0.3em] text-ink"
        >
          IZINIX<span className="text-accent">.</span>
        </span>
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | undefined;
  "data-cursor"?: string;
  onNavigate?: () => void;
};

export function TransitionLink({
  href,
  children,
  onNavigate,
  ...rest
}: TransitionLinkProps) {
  const navigate = useTransitionNavigate();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Respect new-tab / download modifiers.
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
    onNavigate?.();
    navigate(href);
  };

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
