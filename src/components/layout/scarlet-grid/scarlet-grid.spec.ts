import { newSpecPage } from '@stencil/core/testing';
import { ScarletGrid } from './scarlet-grid';

describe('scarlet-grid', () => {
  it('sets --scarlet-grid-columns from the columns prop, defaulting to 12', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid></scarlet-grid>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns')).toBe('12');
  });

  it('applies a custom column count', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid columns="4"></scarlet-grid>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns')).toBe('4');
  });

  it('only sets the breakpoint column custom properties that were actually passed', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid columns="1" columns-md="3"></scarlet-grid>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns')).toBe('1');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns-md')).toBe('3');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns-sm')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns-lg')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-columns-xl')).toBe('');
  });

  it('uses the same gap for rows and columns by default', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid gap="lg"></scarlet-grid>'
    });

    expect(page.root?.style.rowGap).toBe('var(--scarlet-space-6)');
    expect(page.root?.style.columnGap).toBe('var(--scarlet-space-6)');
  });

  it('lets rowGap/columnGap override the shared gap independently', async () => {
    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid gap="md" row-gap="xs" column-gap="xl"></scarlet-grid>'
    });

    expect(page.root?.style.rowGap).toBe('var(--scarlet-space-1)');
    expect(page.root?.style.columnGap).toBe('var(--scarlet-space-8)');
  });

  it('defaults align/justify to stretch and reflects a custom value in the host class', async () => {
    const defaultPage = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid></scarlet-grid>'
    });
    expect(defaultPage.root?.classList.contains('scarlet-grid-host--align-stretch')).toBe(true);
    expect(defaultPage.root?.classList.contains('scarlet-grid-host--justify-stretch')).toBe(true);

    const page = await newSpecPage({
      components: [ScarletGrid],
      html: '<scarlet-grid align="center" justify="end"></scarlet-grid>'
    });
    expect(page.root?.classList.contains('scarlet-grid-host--align-center')).toBe(true);
    expect(page.root?.classList.contains('scarlet-grid-host--justify-end')).toBe(true);
  });
});
