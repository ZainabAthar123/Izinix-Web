/**
 * Re-mounts on every navigation, giving each page a soft staggered
 * entrance (CSS-only; disabled under prefers-reduced-motion).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
