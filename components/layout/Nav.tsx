"use client";

/**
 * Fixed glassmorphic nav. Transparent at the top of the page, frosts
 * (light 12px blur) once the user scrolls. Mobile gets a glass dropdown.
 */
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { TransitionLink } from "@/components/layout/PageTransition";
import MagneticButton from "@/components/ui/MagneticButton";
import { Icon } from "@/components/ui/icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu when the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-nav">
      <div className="container-x">
        <nav
          aria-label="Main"
          className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-glass ease-glass sm:px-6 ${
            scrolled || open ? "glass glass--nav" : ""
          }`}
        >
          <TransitionLink
            href="/"
            aria-label="Izinix — home"
            className="font-display text-lg font-semibold tracking-[0.25em] text-ink"
          >
            IZINIX<span className="text-accent">.</span>
          </TransitionLink>

          {/* Desktop links */}
          <ul className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <li key={link.href}>
                <TransitionLink
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`link-underline font-display text-sm tracking-wide transition-colors duration-300 ${
                    pathname === link.href
                      ? "text-accent"
                      : "text-ink-secondary hover:text-ink"
                  }`}
                >
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <MagneticButton href="/contact" variant="primary">
              Start a Project
            </MagneticButton>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="glass glass--chip glass-press flex h-10 w-10 items-center justify-center text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </nav>

        {/* Mobile dropdown */}
        {open ? (
          <div
            id="mobile-menu"
            className="glass glass--card mt-2 flex flex-col gap-1 p-3 md:hidden"
          >
            {links.map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onNavigate={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 font-display text-base ${
                  pathname === link.href
                    ? "bg-white/[0.06] text-accent"
                    : "text-ink-secondary"
                }`}
              >
                {link.label}
              </TransitionLink>
            ))}
            <div className="p-2 pt-3">
              <MagneticButton href="/contact" variant="primary" className="w-full justify-center">
                Start a Project
              </MagneticButton>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
