/**
 * Central GSAP entry point.
 * Import gsap/ScrollTrigger from here so the plugin is registered exactly once
 * and only in the browser (GSAP is a client-side concern; never import this
 * from a Server Component).
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
