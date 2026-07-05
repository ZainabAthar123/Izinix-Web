/**
 * Infinite text marquee (pure CSS animation, duplicated track).
 * Decorative only — hidden from assistive tech.
 */
type MarqueeProps = {
  text: string;
  className?: string;
  /** Seconds per loop. */
  duration?: number;
};

export default function Marquee({
  text,
  className = "",
  duration = 42,
}: MarqueeProps) {
  const chunk = `${text} — `;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden whitespace-nowrap ${className}`}
    >
      <div
        className="inline-flex animate-marquee will-change-transform"
        style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
      >
        <span className="pr-4">{chunk.repeat(4)}</span>
        <span className="pr-4">{chunk.repeat(4)}</span>
      </div>
    </div>
  );
}
