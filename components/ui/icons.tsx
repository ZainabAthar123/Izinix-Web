/**
 * Minimal line-icon set (1.5px stroke, currentColor).
 * Add icons by extending the `paths` map — keep them 24×24 viewBox.
 */
import type { SVGProps } from "react";

export type IconName =
  | "code"
  | "vector"
  | "quill"
  | "spark"
  | "compass"
  | "radar"
  | "rocket"
  | "warn"
  | "check"
  | "arrow-right"
  | "arrow-up-right"
  | "mail"
  | "pin"
  | "chevron-down"
  | "menu"
  | "close"
  | "linkedin"
  | "x"
  | "instagram"
  | "dribbble";

const paths: Record<IconName, React.ReactNode> = {
  code: (
    <>
      <path d="M8 6 3 12l5 6" />
      <path d="m16 6 5 6-5 6" />
      <path d="m13 4-2 16" />
    </>
  ),
  vector: (
    <>
      <rect x="3" y="3" width="4" height="4" rx="1" />
      <rect x="17" y="3" width="4" height="4" rx="1" />
      <rect x="10" y="17" width="4" height="4" rx="1" />
      <path d="M7 5h10M5 7c0 6 3 10 5 12M19 7c0 6-3 10-5 12" />
    </>
  ),
  quill: (
    <>
      <path d="M20 4c-6 0-12 4-14 10l-2 6 6-2c6-2 10-8 10-14Z" />
      <path d="M4 20 14 10" />
    </>
  ),
  spark: (
    <>
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
      <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
      <path d="m5 5 2.5 2.5M16.5 16.5 19 19M19 5l-2.5 2.5M7.5 16.5 5 19" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 12 18 6M12 3v2M21 12h-2M12 19v2M5 12H3" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 15c-2 0-4-1-5-2 1-5 4-9 9-10 1 5-1 9-4 12Z" />
      <path d="M9 13c-2 0-4 1-5 4 3-1 4 0 4 0s1 1 0 4c3-1 4-3 4-5" />
      <circle cx="13.5" cy="8.5" r="1.5" />
    </>
  ),
  warn: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.5 2.5 2.5L16 9.5" />
    </>
  ),
  "arrow-right": <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  "arrow-up-right": <path d="M7 17 17 7m0 0H8m9 0v9" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21c4-4 7-7.6 7-11a7 7 0 1 0-14 0c0 3.4 3 7 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v1" />
    </>
  ),
  x: <path d="M4 4l16 16M20 4 4 20" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.2 6.8v.01" />
    </>
  ),
  dribbble: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5 9.5c4.5 1 9.5.5 13-2.5M8 3.8c3 3.5 5.5 8 6.7 16M19 15c-3.5-1.5-8-1.5-12 1" />
    </>
  ),
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
