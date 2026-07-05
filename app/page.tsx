import Hero from "@/components/sections/Hero";
import QuoteSection from "@/components/sections/QuoteSection";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Showcase from "@/components/sections/Showcase";
import ClosingCTA from "@/components/sections/ClosingCTA";
import { quotes } from "@/lib/data";

/**
 * Homepage. Sections alternate between near-black and navy-tinted
 * gradients (handled inside each section) to create scroll rhythm.
 * Reorder freely — every section is self-contained.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <QuoteSection variant="a" {...quotes[0]} />
      <Services />
      <Process />
      <Showcase />
      <QuoteSection variant="b" {...quotes[1]} />
      <ClosingCTA
        title="Let's build the system that runs your business."
        subtitle="Tell us where the hours go. We'll bring the system that gets them back."
        buttonLabel="Start a Project"
        href="/contact"
      />
    </>
  );
}
