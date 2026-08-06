import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Hand-drawn 24x24 line icons, 1.7px stroke, sharp corners to match the
 * brand. Rendered at currentColor so they inherit text color utilities.
 */
const I = {
  code: (
    <>
      <polyline points="9 6 3 12 9 18" />
      <polyline points="15 6 21 12 15 18" />
    </>
  ),
  layout: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="9" x2="9" y2="20" />
    </>
  ),
  cart: (
    <>
      <polyline points="3 4 6 4 8.5 15 19 15 21 7 7 7" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="17.5" cy="19" r="1.4" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7a5 5 0 0 1 5 5" />
      <line x1="12" y1="12" x2="18.5" y2="5.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <line x1="12" y1="16" x2="16.5" y2="9.5" />
      <line x1="3" y1="19.5" x2="21" y2="19.5" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" />
      <line x1="12" y1="2.5" x2="12" y2="7" />
      <line x1="12" y1="17" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="7" y2="12" />
      <line x1="17" y1="12" x2="21.5" y2="12" />
    </>
  ),
  drone: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <rect x="9.5" y="9.5" width="5" height="5" />
    </>
  ),
  alert: (
    <>
      <path d="M12 3 22 20H2Z" />
      <line x1="12" y1="9.5" x2="12" y2="14" />
      <circle cx="12" cy="16.8" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 20 6v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6Z" />
      <polyline points="8.5 12 11 14.5 15.5 9.5" />
    </>
  ),
  access: (
    <>
      <circle cx="12" cy="5" r="2" />
      <line x1="4.5" y1="9" x2="19.5" y2="9" />
      <line x1="12" y1="9" x2="12" y2="14" />
      <line x1="12" y1="14" x2="8" y2="21" />
      <line x1="12" y1="14" x2="16" y2="21" />
    </>
  ),
  plug: (
    <>
      <path d="M9 8V3M15 8V3" />
      <path d="M6 8h12v3a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z" />
      <line x1="12" y1="17" x2="12" y2="21.5" />
    </>
  ),
  door: (
    <>
      <rect x="6" y="3" width="12" height="18" />
      <circle cx="15" cy="12.5" r="0.7" fill="currentColor" stroke="none" />
      <line x1="3" y1="21" x2="21" y2="21" />
    </>
  ),
  chart: (
    <>
      <line x1="4" y1="3.5" x2="4" y2="20.5" />
      <line x1="4" y1="20.5" x2="21" y2="20.5" />
      <line x1="9" y1="16.5" x2="9" y2="10" />
      <line x1="13.5" y1="16.5" x2="13.5" y2="6" />
      <line x1="18" y1="16.5" x2="18" y2="12.5" />
    </>
  ),
  link: (
    <>
      <path d="M10 14 14 10" />
      <path d="M12.5 7.5 15 5a3.5 3.5 0 0 1 5 5l-2.5 2.5" />
      <path d="M11.5 16.5 9 19a3.5 3.5 0 0 1-5-5l2.5-2.5" />
    </>
  ),
  zap: <polygon points="13 2.5 5 13.5 11 13.5 10 21.5 19 10 13 10" />,
  ear: (
    <>
      <path d="M7.5 8.5a4.5 4.5 0 0 1 9 0c0 2.6-2.4 3.4-3.4 5-.6 1-.6 2.3-.6 3.5a2.8 2.8 0 0 1-5.6.4" />
      <path d="M10.7 8.7a1.8 1.8 0 0 1 3.6 0c0 1.3-1.3 1.6-1.8 2.8" />
    </>
  ),
  pencil: (
    <>
      <path d="m4 20 1-4L16.5 4.5l3 3L8 19Z" />
      <line x1="14" y1="7" x2="17" y2="10" />
    </>
  ),
  hammer: (
    <>
      <path d="M6 6.5 9.5 3l7 3.5v3L13 8l-9 9L6.5 19l9-9" />
      <line x1="13" y1="6" x2="13" y2="10" />
    </>
  ),
  wrench: (
    <>
      <path d="M14.5 3a5.5 5.5 0 0 0-4.8 8.2L3 18l3 3 6.8-6.7A5.5 5.5 0 0 0 20.8 7L17 10.8 13.2 7 17 3.2A5.5 5.5 0 0 0 14.5 3Z" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.5" y1="15.5" x2="21" y2="21" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  doc: (
    <>
      <path d="M6 2.5h8l4 4V21.5H6Z" />
      <polyline points="14 2.5 14 6.5 18 6.5" />
      <line x1="9" y1="11" x2="15" y2="11" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </>
  ),
  devices: (
    <>
      <rect x="2.5" y="5" width="14" height="10" />
      <line x1="7" y1="19" x2="12" y2="19" />
      <line x1="9.5" y1="15" x2="9.5" y2="19" />
      <rect x="15.5" y="10" width="6" height="9.5" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <polyline points="20 2.5 20 7 15.5 7" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.5c3.5 2 5 6 5 9.5l-2.5 4h-5L7 12c0-3.5 1.5-7.5 5-9.5Z" />
      <circle cx="12" cy="9.5" r="1.6" />
      <path d="M9.5 16 8 21.5l4-2 4 2L14.5 16" />
    </>
  ),
  box: (
    <>
      <path d="M12 2.5 21 7v10l-9 4.5L3 17V7Z" />
      <polyline points="3 7 12 11.5 21 7" />
      <line x1="12" y1="11.5" x2="12" y2="21.5" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" />
      <line x1="2.5" y1="10" x2="21.5" y2="10" />
      <line x1="6" y1="14.5" x2="10" y2="14.5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" />
      <rect x="13.5" y="3.5" width="7" height="7" />
      <rect x="3.5" y="13.5" width="7" height="7" />
      <rect x="13.5" y="13.5" width="7" height="7" />
    </>
  ),
  trend: (
    <>
      <polyline points="3 17.5 9 11.5 13 15 21 6.5" />
      <polyline points="15.5 6.5 21 6.5 21 12" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5S5 14.5 5 9.5a7 7 0 0 1 14 0c0 5-7 12-7 12Z" />
      <circle cx="12" cy="9.5" r="2.2" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3.5 13.8 10.2 20.5 12 13.8 13.8 12 20.5 10.2 13.8 3.5 12 10.2 10.2Z" />
    </>
  ),
  send: (
    <>
      <path d="M21 3.5 3 10.5l7 3 3 7Z" />
      <line x1="10" y1="13.5" x2="21" y2="3.5" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 21 8l-9 5-9-5Z" />
      <polyline points="3 12.5 12 17.5 21 12.5" />
      <polyline points="3 17 12 22 21 17" />
    </>
  ),
  pulse: (
    <>
      <polyline points="2.5 12.5 7 12.5 9.5 6 13.5 19 16 12.5 21.5 12.5" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 6.5 12 12 16 14.5" />
    </>
  ),
  map: (
    <>
      <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
      <line x1="9" y1="4" x2="9" y2="17" />
      <line x1="15" y1="6.5" x2="15" y2="19.5" />
    </>
  ),
  flask: (
    <>
      <path d="M9.5 3h5M10.5 3v6L4.5 19.5a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L13.5 9V3" />
      <line x1="7" y1="15.5" x2="17" y2="15.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20.5a5.5 5.5 0 0 1 11 0" />
      <path d="M15.5 5.5a3.2 3.2 0 0 1 0 5.8" />
      <path d="M17 15.5a5.5 5.5 0 0 1 3.5 5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  video: (
    <>
      <rect x="2.5" y="6.5" width="13" height="11" />
      <polygon points="15.5 11 21.5 7.5 21.5 16.5 15.5 13" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" />
      <line x1="7.5" y1="4" x2="7.5" y2="20" />
      <line x1="16.5" y1="4" x2="16.5" y2="20" />
      <line x1="3" y1="9" x2="7.5" y2="9" />
      <line x1="3" y1="14" x2="7.5" y2="14" />
      <line x1="16.5" y1="9" x2="21" y2="9" />
      <line x1="16.5" y1="14" x2="21" y2="14" />
    </>
  ),
  bug: (
    <>
      <circle cx="12" cy="13" r="5.5" />
      <path d="M12 7.5V5M9 5.5 7.5 3.5M15 5.5l1.5-2M6.5 11H3M6.8 16 4 18M17.5 11H21M17.2 16l2.8 2" />
    </>
  ),
  flag: (
    <>
      <line x1="5" y1="2.5" x2="5" y2="21.5" />
      <path d="M5 4h14l-3 4.5 3 4.5H5" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="2.8" />
      <path d="M4 5.5v13c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8v-13" />
      <path d="M4 12c0 1.5 3.6 2.8 8 2.8s8-1.3 8-2.8" />
    </>
  ),
  building: (
    <>
      <rect x="5" y="3.5" width="14" height="18" />
      <line x1="2.5" y1="21.5" x2="21.5" y2="21.5" />
      <path d="M9 7.5h2M13 7.5h2M9 11.5h2M13 11.5h2M9 15.5h2M13 15.5h2" />
    </>
  ),
  phone: (
    <>
      <path d="M5 3.5h4l1.5 5-2.5 2a12 12 0 0 0 5.5 5.5l2-2.5 5 1.5v4a2 2 0 0 1-2 2A16.5 16.5 0 0 1 3 5.5a2 2 0 0 1 2-2Z" />
    </>
  ),
  heart: (
    <path d="M12 20.5S3 15 3 8.8A4.8 4.8 0 0 1 12 6.5 4.8 4.8 0 0 1 21 8.8C21 15 12 20.5 12 20.5Z" />
  ),
  cross: (
    <path d="M9.5 3h5v6.5H21v5h-6.5V21h-5v-6.5H3v-5h6.5Z" />
  ),
  truck: (
    <>
      <rect x="2.5" y="6" width="12" height="10" />
      <path d="M14.5 9.5H19l2.5 3.5v3h-7" />
      <circle cx="6.5" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
  home: (
    <>
      <path d="M3.5 11 12 3.5 20.5 11" />
      <path d="M5.5 9.5V20.5h13V9.5" />
      <rect x="10" y="14.5" width="4" height="6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </>
  ),
  wine: (
    <>
      <path d="M8 3h8c0 5-1.5 8-4 8s-4-3-4-8Z" />
      <line x1="12" y1="11" x2="12" y2="19" />
      <line x1="8.5" y1="21" x2="15.5" y2="21" />
    </>
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof I

interface Props {
  name: IconName
  className?: string
  /** pixel size, default 24 */
  size?: number
}

export function Icon({ name, className, size = 24 }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
      className={cn('shrink-0', className)}
    >
      {I[name]}
    </svg>
  )
}
