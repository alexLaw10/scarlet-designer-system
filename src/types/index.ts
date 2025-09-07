// Scarlet Design System - Type Definitions

// Base component props
export interface BaseComponentProps {
  /** Custom CSS class */
  class?: string;
  /** Custom CSS styles */
  style?: string | Record<string, string>;
  /** Unique identifier */
  id?: string;
  /** Accessibility label */
  'aria-label'?: string;
  /** Accessibility described by */
  'aria-describedby'?: string;
  /** Accessibility labelled by */
  'aria-labelledby'?: string;
  /** Role for accessibility */
  role?: string;
  /** Tab index for keyboard navigation */
  tabindex?: number;
}

// Size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Color variants
export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

// Variant types
export type Variant = 'solid' | 'outline' | 'ghost' | 'link';

// Position types
export type Position = 'top' | 'right' | 'bottom' | 'left' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end';

// Alignment types
export type Alignment = 'start' | 'center' | 'end' | 'stretch';

// Justify content types
export type JustifyContent = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

// Direction types
export type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse';

// Wrap types
export type Wrap = 'nowrap' | 'wrap' | 'wrap-reverse';

// Event handlers
export interface EventHandlers {
  onClick?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onKeyDown?: (event: KeyboardEvent) => void;
  onKeyUp?: (event: KeyboardEvent) => void;
  onChange?: (event: Event) => void;
  onInput?: (event: Event) => void;
}

// Theme interface
export interface Theme {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    neutral: Record<string, string>;
    success: Record<string, string>;
    warning: Record<string, string>;
    error: Record<string, string>;
    info: Record<string, string>;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
  };
  shadows: Record<string, string>;
  borders: {
    radius: Record<string, string>;
    width: Record<string, string>;
  };
}

// Component state
export interface ComponentState {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}

// Accessibility props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-selected'?: boolean;
  'aria-checked'?: boolean;
  'aria-pressed'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-required'?: boolean;
  'aria-invalid'?: boolean;
  'aria-disabled'?: boolean;
  'aria-readonly'?: boolean;
  role?: string;
  tabindex?: number;
}
