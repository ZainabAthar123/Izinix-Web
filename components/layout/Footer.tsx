"use client";

/**
 * Site footer: oversized wordmark, sitemap, services, contact, socials.
 */
import { TransitionLink } from "@/components/layout/PageTransition";
import { Icon } from "@/components/ui/icons";
import { services, site } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg-secondary">
      {/* Ambient navy glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-navy-glow), transparent)",
        }}
      />

      <div className="container-x relative py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-4xl font-semibold tracking-tightest text-ink sm:text-5xl">
              IZINIX<span className="text-accent">.</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-secondary">
              An AI automation agency. We design, build, and automate the
              systems that run modern businesses.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-underline mt-6 inline-flex items-center gap-2 font-display text-lg text-ink"
            >
              <Icon name="mail" size={18} className="text-accent" />
              {site.email}
            </a>
          </div>

          <nav aria-label="Sitemap">
            <p className="eyebrow-accent mb-5">Sitemap</p>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/work", label: "Work" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <TransitionLink
                    href={link.href}
                    className="text-sm text-ink-secondary transition-colors duration-300 hover:text-ink"
                  >
                    {link.label}
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow-accent mb-5">Services</p>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.index} className="text-sm text-ink-secondary">
                  {service.title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow-accent mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-ink-secondary">
              <li className="flex items-start gap-2">
                <Icon name="pin" size={16} className="mt-0.5 shrink-0 text-ink-tertiary" />
                {site.location}
              </li>
            </ul>
            <div className="mt-6 flex gap-3">
              {site.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="glass glass--chip glass-hover glass-press flex h-10 w-10 items-center justify-center text-ink-secondary transition-colors duration-300 hover:text-accent"
                >
                  <Icon name={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 text-xs text-ink-tertiary sm:flex-row sm:items-center">
          <p>
            © {year} {site.name} — {site.tagline}. Placeholder details; replace
            with real company information.
          </p>
          <p className="font-mono tracking-widest">
            BUILT_TO_RUN // WHILE_YOU_GROW
          </p>
        </div>
      </div>
    </footer>
  );
}
