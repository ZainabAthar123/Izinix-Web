import type { Metadata } from "next";
import WorkShowcase from "@/components/sections/WorkShowcase";

export const metadata: Metadata = {
  title: "Work & Use Cases",
  description:
    "Before-and-after scenarios of the systems we design, build, and automate — support, lead routing, onboarding, content, and reporting.",
};

export default function WorkPage() {
  return <WorkShowcase />;
}
