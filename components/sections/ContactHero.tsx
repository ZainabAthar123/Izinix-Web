"use client";

/**
 * Contact page body: split layout — headline + contact details on the
 * left (interactive background continuing behind), glass form card on
 * the right.
 */
import dynamic from "next/dynamic";
import AnimatedText from "@/components/ui/AnimatedText";
import ContactForm from "@/components/sections/ContactForm";
import { Icon } from "@/components/ui/icons";
import { site } from "@/lib/data";

const HeroBackground = dynamic(
  () => import("@/components/three/HeroBackground"),
  { ssr: false },
);

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden pb-28 pt-44">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 30% 0%, var(--color-navy) 0%, var(--color-bg-primary) 70%)",
        }}
      />
      <HeroBackground opacity={0.3} density={0.7} />

      <div className="container-x relative z-10 grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow-accent mb-6">Contact</p>
          <h1 className="h-display max-w-xl !text-[clamp(3.2rem,3.5vw+1.8rem,5.5rem)]">
            <AnimatedText trigger="load" delay={0.2}>
              Tell us what slows you down.
            </AnimatedText>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-secondary sm:text-lg">
            One call is usually enough to find the first workflow worth
            automating. No deck, no discovery fee — just your process and our
            questions.
          </p>

          <dl className="mt-12 space-y-6">
            <div className="flex items-start gap-4">
              <span className="glass glass--chip flex h-11 w-11 shrink-0 items-center justify-center text-accent">
                <Icon name="mail" size={18} />
              </span>
              <div>
                <dt className="eyebrow mb-1">Email</dt>
                <dd>
                  <a
                    href={`mailto:${site.email}`}
                    className="link-underline pb-0.5 font-display text-lg text-ink"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="glass glass--chip flex h-11 w-11 shrink-0 items-center justify-center text-accent">
                <Icon name="pin" size={18} />
              </span>
              <div>
                <dt className="eyebrow mb-1">Location</dt>
                <dd className="text-ink-secondary">{site.location}</dd>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <span className="glass glass--chip flex h-11 w-11 shrink-0 items-center justify-center text-accent">
                <Icon name="spark" size={18} />
              </span>
              <div>
                <dt className="eyebrow mb-1">Response time</dt>
                <dd className="text-ink-secondary">Within one business day.</dd>
              </div>
            </div>
          </dl>

          <div className="mt-10 flex gap-3">
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

        <ContactForm />
      </div>
    </section>
  );
}
