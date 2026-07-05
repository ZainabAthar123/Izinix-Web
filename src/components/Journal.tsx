import { motion } from "framer-motion";

interface Entry {
  title: string;
  image: string;
  readTime: string;
  date: string;
}

const ENTRIES: Entry[] = [
  {
    title: "Designing for motion-first interfaces",
    image: "https://picsum.photos/seed/journal-motion/200/200",
    readTime: "6 min read",
    date: "Mar 2026",
  },
  {
    title: "The quiet power of grid systems",
    image: "https://picsum.photos/seed/journal-grid/200/200",
    readTime: "4 min read",
    date: "Jan 2026",
  },
  {
    title: "Building a design system that scales",
    image: "https://picsum.photos/seed/journal-system/200/200",
    readTime: "8 min read",
    date: "Nov 2025",
  },
  {
    title: "Notes on shipping fast without breaking trust",
    image: "https://picsum.photos/seed/journal-ship/200/200",
    readTime: "5 min read",
    date: "Sep 2025",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          {...fadeUp}
          className="flex items-end justify-between mb-10 md:mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Journal
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary">
              Recent <span className="italic">thoughts</span>
            </h2>
            <p className="text-sm md:text-base text-muted mt-4 max-w-md">
              Writing on design systems, process, and the craft of building
              interfaces.
            </p>
          </div>

          <a
            href="#journal"
            className="hidden md:inline-flex group relative rounded-full"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 rounded-full border-2 border-stroke group-hover:border-transparent bg-bg text-sm px-6 py-3 text-text-primary transition-colors duration-300">
              View all <span aria-hidden="true">→</span>
            </span>
          </a>
        </motion.div>

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry) => (
            <motion.a
              key={entry.title}
              href="#journal"
              {...fadeUp}
              className="flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke rounded-[40px] sm:rounded-full transition-colors duration-300"
            >
              <img
                src={entry.image}
                alt=""
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base md:text-lg text-text-primary truncate">
                  {entry.title}
                </h3>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-muted flex-shrink-0 pr-4">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span>{entry.date}</span>
              </div>
              <span className="hidden sm:flex w-9 h-9 rounded-full border border-stroke items-center justify-center flex-shrink-0 text-text-primary">
                ↗
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
