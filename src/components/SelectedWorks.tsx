import { motion } from "framer-motion";

interface Project {
  title: string;
  image: string;
  colSpan: string;
  aspect: string;
}

const PROJECTS: Project[] = [
  {
    title: "Automotive Motion",
    image: "https://picsum.photos/seed/automotive-motion/1200/900",
    colSpan: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
  {
    title: "Urban Architecture",
    image: "https://picsum.photos/seed/urban-architecture/900/1100",
    colSpan: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Human Perspective",
    image: "https://picsum.photos/seed/human-perspective/900/1100",
    colSpan: "md:col-span-5",
    aspect: "aspect-[4/5]",
  },
  {
    title: "Brand Identity",
    image: "https://picsum.photos/seed/brand-identity/1200/900",
    colSpan: "md:col-span-7",
    aspect: "aspect-[4/3]",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1] as const },
};

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <motion.div
          {...fadeUp}
          className="flex items-end justify-between mb-10 md:mb-14"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Selected Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary">
              Featured <span className="italic">projects</span>
            </h2>
            <p className="text-sm md:text-base text-muted mt-4 max-w-md">
              A selection of projects I&apos;ve worked on, from concept to
              launch.
            </p>
          </div>

          <a
            href="#work"
            className="hidden md:inline-flex group relative rounded-full"
          >
            <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2 rounded-full border-2 border-stroke group-hover:border-transparent bg-bg text-sm px-6 py-3 text-text-primary transition-colors duration-300">
              View all work <span aria-hidden="true">→</span>
            </span>
          </a>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project) => (
            <motion.div
              key={project.title}
              {...fadeUp}
              className={`group relative overflow-hidden bg-surface border border-stroke rounded-3xl ${project.colSpan} ${project.aspect}`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #000 1px, transparent 1px)",
                  backgroundSize: "4px 4px",
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-bg/70 opacity-0 group-hover:opacity-100 backdrop-blur-lg transition-opacity duration-300">
                <div className="relative rounded-full p-[1.5px] accent-gradient-animated">
                  <span className="flex items-center gap-2 rounded-full bg-white text-bg text-sm px-6 py-3">
                    View — <span className="font-display italic">{project.title}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
