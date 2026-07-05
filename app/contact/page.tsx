import type { Metadata } from "next";
import ContactHero from "@/components/sections/ContactHero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Izinix. Tell us what slows your team down — we reply within one business day.",
};

export default function ContactPage() {
  return <ContactHero />;
}
