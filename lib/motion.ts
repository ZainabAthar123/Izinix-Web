"use client";

import { useEffect, useState } from "react";

/** Imperative check — safe to call inside effects/handlers only. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Reactive media-query hook. Returns `false` on the server/first paint. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** Coarse pointer ≈ touch device: used to disable cursor/magnetic effects. */
export function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
