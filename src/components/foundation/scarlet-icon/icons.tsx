import { h } from '@stencil/core';

/**
 * Names of the built-in icon set. All icons share a 24x24 viewBox and are
 * drawn stroke-only (`stroke="currentColor"`, `fill="none"`) except for
 * small filled dots, so they inherit color and align consistently at any
 * size.
 */
export type ScarletIconName =
  | 'check'
  | 'check-circle'
  | 'x'
  | 'x-circle'
  | 'plus'
  | 'minus'
  | 'chevron-up'
  | 'chevron-down'
  | 'chevron-left'
  | 'chevron-right'
  | 'arrow-up'
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'alert-triangle'
  | 'alert-circle'
  | 'info-circle'
  | 'search'
  | 'user'
  | 'star'
  | 'heart'
  | 'trash'
  | 'pencil'
  | 'eye'
  | 'eye-off'
  | 'calendar'
  | 'clock'
  | 'mail'
  | 'lock'
  | 'settings'
  | 'external-link'
  | 'more-horizontal'
  | 'more-vertical';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IconRenderer = () => any;

export const scarletIcons: Record<ScarletIconName, IconRenderer> = {
  check: () => <polyline points="4,12 9,17 20,6" />,
  'check-circle': () => (
    <g>
      <circle cx="12" cy="12" r="9" />
      <polyline points="8,12.5 11,15.5 16,9" />
    </g>
  ),
  x: () => (
    <g>
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </g>
  ),
  'x-circle': () => (
    <g>
      <circle cx="12" cy="12" r="9" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </g>
  ),
  plus: () => (
    <g>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </g>
  ),
  minus: () => <line x1="5" y1="12" x2="19" y2="12" />,
  'chevron-up': () => <polyline points="6,15 12,9 18,15" />,
  'chevron-down': () => <polyline points="6,9 12,15 18,9" />,
  'chevron-left': () => <polyline points="15,6 9,12 15,18" />,
  'chevron-right': () => <polyline points="9,6 15,12 9,18" />,
  'arrow-up': () => (
    <g>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="6,11 12,5 18,11" />
    </g>
  ),
  'arrow-down': () => (
    <g>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="6,13 12,19 18,13" />
    </g>
  ),
  'arrow-left': () => (
    <g>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11,6 5,12 11,18" />
    </g>
  ),
  'arrow-right': () => (
    <g>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13,6 19,12 13,18" />
    </g>
  ),
  'alert-triangle': () => (
    <g>
      <polygon points="12,3.5 21,19.5 3,19.5" stroke-linejoin="round" />
      <line x1="12" y1="10" x2="12" y2="14.5" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </g>
  ),
  'alert-circle': () => (
    <g>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="8" x2="12" y2="13" />
      <circle cx="12" cy="16.2" r="0.75" fill="currentColor" stroke="none" />
    </g>
  ),
  'info-circle': () => (
    <g>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r="0.75" fill="currentColor" stroke="none" />
    </g>
  ),
  search: () => (
    <g>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <line x1="15.3" y1="15.3" x2="20" y2="20" />
    </g>
  ),
  user: () => (
    <g>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-4 5-6 7.5-6s6 2 7.5 6" />
    </g>
  ),
  star: () => (
    <polygon
      points="12,3 14.7,9.2 21.5,9.8 16.3,14.3 17.9,21 12,17.3 6.1,21 7.7,14.3 2.5,9.8 9.3,9.2"
      stroke-linejoin="round"
    />
  ),
  heart: () => (
    <path
      d="M12 20.5c-4-2.7-8.5-6-8.5-10.3A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.5 3.5c0 4.3-4.5 7.6-8.5 10.3z"
      stroke-linejoin="round"
    />
  ),
  trash: () => (
    <g>
      <path d="M5 7h14" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </g>
  ),
  pencil: () => (
    <g>
      <path d="M4 20l1-4.5L15.5 5A2.1 2.1 0 0 1 18.5 8L8 18.5z" stroke-linejoin="round" />
      <line x1="13.5" y1="6.5" x2="17" y2="10" />
    </g>
  ),
  eye: () => (
    <g>
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12z" stroke-linejoin="round" />
      <circle cx="12" cy="12" r="2.5" />
    </g>
  ),
  'eye-off': () => (
    <g>
      <path d="M6 6.5C3.5 8 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1" />
      <path d="M17 8.5c2 1.4 3 3.5 3 3.5s-1 2.3-3 3.9" />
      <circle cx="12" cy="12" r="2.5" />
      <line x1="3.5" y1="3.5" x2="20.5" y2="20.5" />
    </g>
  ),
  calendar: () => (
    <g>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </g>
  ),
  clock: () => (
    <g>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="12" x2="12" y2="7" />
      <line x1="12" y1="12" x2="15.5" y2="14" />
    </g>
  ),
  mail: () => (
    <g>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <polyline points="3.5,6.5 12,13 20.5,6.5" />
    </g>
  ),
  lock: () => (
    <g>
      <rect x="5" y="11" width="14" height="9.5" rx="1.5" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </g>
  ),
  settings: () => (
    <g>
      <circle cx="12" cy="12" r="3.2" />
      <line x1="12" y1="2.5" x2="12" y2="5.5" />
      <line x1="12" y1="18.5" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5.5" y2="12" />
      <line x1="18.5" y1="12" x2="21.5" y2="12" />
      <line x1="5.4" y1="5.4" x2="7.5" y2="7.5" />
      <line x1="16.5" y1="16.5" x2="18.6" y2="18.6" />
      <line x1="5.4" y1="18.6" x2="7.5" y2="16.5" />
      <line x1="16.5" y1="7.5" x2="18.6" y2="5.4" />
    </g>
  ),
  'external-link': () => (
    <g>
      <path d="M10 5H5a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 5 20h12a1.5 1.5 0 0 0 1.5-1.5V14" />
      <polyline points="14,4 20,4 20,10" />
      <line x1="10.5" y1="13.5" x2="19.5" y2="4.5" />
    </g>
  ),
  'more-horizontal': () => (
    <g fill="currentColor" stroke="none">
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </g>
  ),
  'more-vertical': () => (
    <g fill="currentColor" stroke="none">
      <circle cx="12" cy="5" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="19" r="1.4" />
    </g>
  ),
};

export const scarletIconNames = Object.keys(scarletIcons) as ScarletIconName[];
