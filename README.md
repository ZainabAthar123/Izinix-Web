# Izinix — AI Automation Agency

An Awwwards-tier marketing site: Next.js 14 (App Router) + TypeScript,
Tailwind design tokens, GSAP + ScrollTrigger, a Three.js interactive hero
(react-three-fiber), Lenis smooth scrolling, and a layered glassmorphism
design system over a black / dark-navy / electric-orange palette.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (Vercel-ready)
```

> All copy, projects, quotes, and contact details are **realistic
> placeholders** — swap them in `lib/data.ts` before launch.

## Folder structure

```
app/
  layout.tsx            Fonts (next/font), metadata, global chrome
  template.tsx          Per-navigation page entrance animation
  page.tsx              Homepage (Hero → Quote → Services → Process → Showcase → Quote → CTA)
  work/page.tsx         Use-case page (filters + Before/After scenarios)
  contact/page.tsx      Contact page (split layout + form)
  api/contact/route.ts  Form endpoint — STUB, wire to email/CRM (see TODO inside)
  globals.css           Design tokens + the glass system + keyframes
components/
  layout/               Nav, Footer, PageTransition, SmoothScroll (Lenis),
                        CustomCursor, ScrollProgress, GrainOverlay
  three/                HeroBackground (r3f particle field, code-split)
  sections/             Hero, QuoteSection, Services, Process, Showcase,
                        ClosingCTA, BeforeAfterScenario, WorkShowcase,
                        ContactHero, ContactForm
  ui/                   GlassCard, MagneticButton, AnimatedText, Marquee, icons
lib/
  data.ts               ALL site content (services, projects, scenarios, quotes)
  gsap.ts               GSAP + ScrollTrigger registered once
  motion.ts             prefers-reduced-motion / media-query hooks
  scroll.ts             Shared Lenis instance + scroll velocity store
```

## Changing the design tokens

**Colors** — edit the `:root` block at the top of `app/globals.css`.
Every Tailwind utility (`bg-bg-primary`, `text-ink-secondary`,
`text-accent`, `border-line`, …) reads those CSS variables through
`tailwind.config.ts`, so one edit rethemes the whole site. The default
Tailwind palette is intentionally removed.

**Fonts** — swap the four `next/font` imports in `app/layout.tsx`
(display / serif / sans / mono). The CSS variables `--font-display`,
`--font-serif`, `--font-sans`, `--font-mono` cascade everywhere. Keep
variable-weight faces for the display font — the hero animates
`font-variation-settings` from weight 300 → ~620 on load.

**Glass** — the frosted-glass system is a set of layered classes in
`app/globals.css` (`.glass` + elevation modifiers `.glass--nav/chip/card/panel`
+ behaviors `.glass-hover`, `.glass-press`). It builds four layers: blur+tint,
gradient border (`::before`), depth shadows, and specular highlight + noise
(`::after`). Blur intensity scales with elevation and is automatically
reduced on mobile. `components/ui/GlassCard.tsx` adds the cursor-following
specular for large cards.

## Adding content

- **Showcase project**: append to `projects` in `lib/data.ts`
  (`hueA`/`hueB`/`angle` drive the generated cover art — replace the art
  block in `components/sections/Showcase.tsx` with a real image/video when
  available).
- **Before/After scenario**: append to `scenarios` in `lib/data.ts` —
  `number`, `tag` (drives the Work-page filter), `monoLabel`, three
  before/after bullet points each, and an `outcome` line. The pinned
  scan-line reveal is automatic.
- **Service / process step / quote**: same idea, same file.
- **Case-study detail pages**: create `app/work/[slug]/page.tsx` and key it
  off `projects[].slug` — the data model already supports it.

## Contact form

Client-side validation is React Hook Form + Zod (`components/sections/
ContactForm.tsx`), with a honeypot field for basic spam protection. The
endpoint `app/api/contact/route.ts` currently logs to the server console —
the TODO inside marks where to plug in Resend/Postmark/a CRM webhook.

## Motion & performance notes

- Three.js canvas is dynamically imported (`ssr: false`), pauses off-screen
  and in hidden tabs, and is replaced by a static gradient on mobile and
  under `prefers-reduced-motion`.
- Lenis drives native scroll and feeds GSAP's ScrollTrigger; disabled under
  reduced motion. Pinned/scrubbed effects (Process rail, Before/After scan
  reveal) fall back to simple fades on mobile/reduced motion via
  `gsap.matchMedia`.
- The custom cursor and magnetic buttons deactivate on coarse pointers;
  everything stays keyboard-navigable with a visible orange focus ring.
- Body text is `#9AA3B2` on `#05070A` (≈8.7:1) — comfortably WCAG AA.

## Deployment

Vercel-ready with zero config. The only server-side piece is
`app/api/contact/route.ts`; everything else pre-renders statically.
