import { newSpecPage } from '@stencil/core/testing';
import { ScarletGrid } from './scarlet-grid';

describe('scarlet-grid', () => {
  it('sets grid-template-columns from the columns prop, defaulting to 12', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: `<scarlet-grid></scarlet-grid>`,
    });

    expect(page.root?.style.gridTemplateColumns).toBe('repeat(12, minmax(0, 1fr))');
  });

  it('applies a custom column count', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: `<scarlet-grid columns="4"></scarlet-grid>`,
    });

    expect(page.root?.style.gridTemplateColumns).toBe('repeat(4, minmax(0, 1fr))');
  });

  it('uses the same gap for rows and columns by default', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: `<scarlet-grid gap="lg"></scarlet-grid>`,
    });

    expect(page.root?.style.rowGap).toBe('var(--scarlet-space-6)');
    expect(page.root?.style.columnGap).toBe('var(--scarlet-space-6)');
  });

  it('lets rowGap/columnGap override the shared gap independently', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: `<scarlet-grid gap="md" row-gap="xs" column-gap="xl"></scarlet-grid>`,
    });

    expect(page.root?.style.rowGap).toBe('var(--scarlet-space-1)');
    expect(page.root?.style.columnGap).toBe('var(--scarlet-space-8)');
  });
});
