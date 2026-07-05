/**
 * Full-page animated film grain — keeps the dark UI from reading as
 * flat digital black. Purely decorative, extremely low opacity.
 */
export default function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      className="grain pointer-events-none fixed inset-0 z-grain opacity-[0.05] mix-blend-overlay"
    />
  );
}
