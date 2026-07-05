import type Lenis from "lenis";

/**
 * Tiny shared store for scroll state.
 * - `velocity` is written by the Lenis loop and read by the Three.js
 *   background every frame (avoids React re-renders at scroll speed).
 * - `lenis` lets the page-transition layer reset scroll position instantly.
 */
export const scrollState: { velocity: number; lenis: Lenis | null } = {
  velocity: 0,
  lenis: null,
};
