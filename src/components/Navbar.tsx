import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Work", id: "work" },
  { label: "Resume", id: "resume" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${
          scrolled ? "shadow-md shadow-black/10" : ""
        }`}
      >
        <button
          onClick={() => scrollToSection("home")}
          className="group w-9 h-9 rounded-full accent-gradient p-[1.5px] transition-transform duration-300 hover:scale-110 hover:[background-image:linear-gradient(270deg,#89AACC_0%,#4E85BF_100%)]"
          aria-label="Scroll to top"
        >
          <span className="w-full h-full rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary">
              JA
            </span>
          </span>
        </button>

        <div className="hidden sm:block w-px h-5 bg-stroke mx-1" />

        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            onClick={() => scrollToSection(link.id)}
            className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-colors duration-200 ${
              active === link.id
                ? "text-text-primary bg-stroke/50"
                : "text-muted hover:text-text-primary hover:bg-stroke/50"
            }`}
          >
            {link.label}
          </button>
        ))}

        <div className="w-px h-5 bg-stroke mx-1" />

        <a href="mailto:hello@michaelsmith.com" className="group relative rounded-full">
          <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-1 rounded-full backdrop-blur-md bg-surface text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 text-muted group-hover:text-text-primary transition-colors duration-200">
            Say hi <span aria-hidden="true">↗</span>
          </span>
        </a>
      </div>
    </nav>
  );
}
