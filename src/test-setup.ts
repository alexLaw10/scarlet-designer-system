// Test setup for Stencil components
import { newSpecPage } from '@stencil/core/testing';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver
// Cast needed: this deliberately-minimal mock doesn't implement every member
// of the real IntersectionObserver interface (root, rootMargin, thresholds,
// takeRecords) — jsdom's tests don't need them, TypeScript's structural
// check does.
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Export newSpecPage for use in tests
export { newSpecPage };
