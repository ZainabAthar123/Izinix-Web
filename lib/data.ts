/**
 * ALL site content lives here.
 * Everything below is deliberately written as *realistic placeholder copy*
 * (no lorem ipsum) — swap names, quotes, and metrics for real client data.
 *
 * To add a service, process step, project, or before/after scenario:
 * append an entry to the matching array. Components render from these
 * arrays, so no markup changes are needed.
 */

import type { IconName } from "@/components/ui/icons";

/* ------------------------------------------------------------------ */
/*  SITE META                                                          */
/* ------------------------------------------------------------------ */
export const site = {
  name: "Izinix",
  tagline: "AI Automation Agency",
  // PLACEHOLDER contact details — replace with the real ones.
  email: "hello@izinix.agency",
  location: "Lahore · Remote, worldwide",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" as IconName },
    { label: "X / Twitter", href: "https://x.com", icon: "x" as IconName },
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" as IconName },
    { label: "Dribbble", href: "https://dribbble.com", icon: "dribbble" as IconName },
  ],
};

/* ------------------------------------------------------------------ */
/*  SERVICES (homepage, section 3)                                     */
/* ------------------------------------------------------------------ */
export type Service = {
  index: string;
  title: string;
  blurb: string;
  detail: string;
  icon: IconName;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Web Development",
    blurb: "Sites and products engineered for speed, scale, and story.",
    detail:
      "Next.js builds that score green on every metric — marketing sites, dashboards, and client portals wired directly into the systems that run your business.",
    icon: "code",
  },
  {
    index: "02",
    title: "UI/UX Design",
    blurb: "Interfaces designed around how people actually decide.",
    detail:
      "Research-backed flows, design systems, and prototypes. We design the screen and the decision behind it, so users move without friction.",
    icon: "vector",
  },
  {
    index: "03",
    title: "Content Creation",
    blurb: "Copy, visuals, and motion that give the system a voice.",
    detail:
      "Brand language, product copy, and content pipelines — including AI-assisted production workflows your team can run without us.",
    icon: "quill",
  },
  {
    index: "04",
    title: "AI Automation",
    blurb: "Custom AI systems that take busywork off your team's plate.",
    detail:
      "Intake, routing, approvals, reporting — we map the manual loops in your operation and replace them with systems that run on your conditions.",
    icon: "spark",
  },
  {
    index: "05",
    title: "Strategy & Consulting",
    blurb: "Roadmaps that connect design, tech, and automation to revenue.",
    detail:
      "Audits, automation roadmaps, and build-vs-buy calls. We tell you what to automate first — and what not to automate at all.",
    icon: "compass",
  },
];

/* ------------------------------------------------------------------ */
/*  PROCESS (homepage, section 4)                                      */
/* ------------------------------------------------------------------ */
export type ProcessStep = {
  index: string;
  title: string;
  description: string;
  icon: IconName;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discover",
    description:
      "We map your workflows, tools, and bottlenecks. Every hour of manual work gets found, named, and priced.",
    icon: "radar",
  },
  {
    index: "02",
    title: "Design",
    description:
      "Interfaces and system architecture are designed together — the screen your team sees and the engine underneath it.",
    icon: "vector",
  },
  {
    index: "03",
    title: "Build",
    description:
      "Short cycles, working software every week. You watch the system come alive instead of waiting for a reveal.",
    icon: "code",
  },
  {
    index: "04",
    title: "Automate",
    description:
      "AI agents and integrations take over the loops humans shouldn't run — intake, routing, approvals, reporting.",
    icon: "spark",
  },
  {
    index: "05",
    title: "Launch & Support",
    description:
      "We ship, monitor, and tune. Your team gets documentation, training, and a system that keeps improving.",
    icon: "rocket",
  },
];

/* ------------------------------------------------------------------ */
/*  SHOWCASE PROJECTS (homepage, section 5)                            */
/*  PLACEHOLDER projects — swap for real case studies.                 */
/*  `hueA`/`hueB`/`angle` drive the generated cover art gradients.     */
/* ------------------------------------------------------------------ */
export type Project = {
  slug: string;
  name: string;
  tag: string;
  summary: string;
  hueA: string;
  hueB: string;
  angle: number;
};

export const projects: Project[] = [
  {
    slug: "atlas-freight",
    name: "Atlas Freight",
    tag: "AI Automation",
    summary: "Dispatch and document intake automated for a 40-truck fleet.",
    hueA: "#1a2c4a",
    hueB: "#ff5a1f",
    angle: 135,
  },
  {
    slug: "northwind-legal",
    name: "Northwind Legal",
    tag: "Web Development",
    summary: "Client intake portal that routes matters before the first call.",
    hueA: "#0e1a2b",
    hueB: "#ff7a3d",
    angle: 45,
  },
  {
    slug: "hearthline-health",
    name: "Hearthline Health",
    tag: "UI/UX Design",
    summary: "Patient onboarding redesigned from 9 forms down to one flow.",
    hueA: "#10151f",
    hueB: "#c2431a",
    angle: 160,
  },
  {
    slug: "forma-studio",
    name: "Forma Studio",
    tag: "Content",
    summary: "A content engine producing 40 assets a week from one brief.",
    hueA: "#1a2c4a",
    hueB: "#ff5a1f",
    angle: 20,
  },
];

/* ------------------------------------------------------------------ */
/*  QUOTES (homepage, sections 2 & 6)                                  */
/*  PLACEHOLDER attributions — replace with real testimonials.         */
/* ------------------------------------------------------------------ */
export type Quote = {
  text: string;
  attribution: string;
  role: string;
};

export const quotes: Quote[] = [
  {
    text: "Every hour your team spends on repetitive work is an hour your competitors spend on work that actually matters.",
    attribution: "Izinix Founding Team",
    role: "On why the studio exists",
  },
  {
    text: "What took our ops team a full day now happens before the first coffee. We stopped hiring for admin and started hiring for growth.",
    attribution: "A. Rehman",
    role: "COO, Atlas Freight — placeholder testimonial",
  },
];

/* ------------------------------------------------------------------ */
/*  BEFORE / AFTER SCENARIOS (work page)                               */
/* ------------------------------------------------------------------ */
export type ScenarioTag = "Web" | "UI/UX" | "Content" | "Automation";

export type Scenario = {
  number: number;
  tag: ScenarioTag;
  monoLabel: string;
  beforeTitle: string;
  beforePoints: string[];
  afterTitle: string;
  afterPoints: string[];
  outcome: string;
};

export const scenarioFilters: Array<"All" | ScenarioTag> = [
  "All",
  "Web",
  "UI/UX",
  "Content",
  "Automation",
];

export const scenarios: Scenario[] = [
  {
    number: 1,
    tag: "Automation",
    monoLabel: "CORE_ENGINE_V4.0 // SCENARIO_01",
    beforeTitle:
      "Your operation runs on effort where it should run on automation.",
    beforePoints: [
      "Support inboxes triaged by hand every morning.",
      "The same three questions answered forty times a week.",
      "Escalations discovered days late, buried in threads.",
    ],
    afterTitle: "We build one system that sees everything.",
    afterPoints: [
      "One AI system handles intake, triage, and routing.",
      "Known questions answered instantly, on-brand, 24/7.",
      "Escalations reach a human in minutes, with full context.",
    ],
    outcome: "First-response time cut from hours to seconds.",
  },
  {
    number: 2,
    tag: "Web",
    monoLabel: "CORE_ENGINE_V4.0 // SCENARIO_02",
    beforeTitle: "Your website collects visitors. Your team collects tabs.",
    beforePoints: [
      "Leads land in a form inbox nobody owns.",
      "Sales copies data between five disconnected tools.",
      "Follow-ups depend on whoever remembers first.",
    ],
    afterTitle: "The site becomes the front door of the system.",
    afterPoints: [
      "Every lead scored, enriched, and routed on arrival.",
      "CRM, calendar, and proposals updated automatically.",
      "Follow-up sequences trigger on your conditions.",
    ],
    outcome: "Lead-to-call time down 84%. Zero leads lost in handoff.",
  },
  {
    number: 3,
    tag: "UI/UX",
    monoLabel: "CORE_ENGINE_V4.0 // SCENARIO_03",
    beforeTitle: "Onboarding that makes new clients do the paperwork.",
    beforePoints: [
      "Nine PDF forms emailed back and forth for signatures.",
      "Status lives in someone's head, not on a screen.",
      "Clients ask 'what happens next?' — nobody's sure.",
    ],
    afterTitle: "One flow that walks the client in the door.",
    afterPoints: [
      "A single guided portal replaces every form.",
      "Live status the client and your team both see.",
      "Documents generated, signed, and filed automatically.",
    ],
    outcome: "Onboarding compressed from two weeks to two days.",
  },
  {
    number: 4,
    tag: "Content",
    monoLabel: "CORE_ENGINE_V4.0 // SCENARIO_04",
    beforeTitle: "Content shipped whenever the calendar allowed it.",
    beforePoints: [
      "One brief becomes one asset, eventually.",
      "Every channel reformatted by hand, every time.",
      "Publishing waits on whoever owns the login.",
    ],
    afterTitle: "A pipeline that turns one brief into a week of content.",
    afterPoints: [
      "AI drafts, humans direct — brand voice enforced by system.",
      "Each asset auto-versioned for every channel.",
      "Scheduled, published, and measured without a handoff.",
    ],
    outcome: "Production volume up 6×. Review time cut in half.",
  },
  {
    number: 5,
    tag: "Automation",
    monoLabel: "CORE_ENGINE_V4.0 // SCENARIO_05",
    beforeTitle: "Every Monday starts with building the same report.",
    beforePoints: [
      "Data pulled manually from four dashboards.",
      "Invoices drafted one by one at month-end.",
      "Approvals stall in email threads for days.",
    ],
    afterTitle: "The numbers arrive before you ask for them.",
    afterPoints: [
      "Reports compile themselves and land in your inbox.",
      "Invoices generated, sent, and chased automatically.",
      "Approvals trigger on your conditions, with an audit trail.",
    ],
    outcome: "Operational overhead cut. Decision cycles compressed.",
  },
];
