// `@stencil/core` doesn't ship a resolvable declaration file for this deep
// internal subpath under either "node" or "bundler" module resolution, even
// though the module itself exists at runtime and `setAssetPath` is real.
// This is the fallback TypeScript itself suggests (TS7016) — a minimal
// ambient declaration so `src/index.ts` type-checks without pretending to
// fully type the internal client runtime.
declare module '@stencil/core/internal/client';
