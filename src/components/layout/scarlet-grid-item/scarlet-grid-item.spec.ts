import { newSpecPage } from '@stencil/core/testing';
import { ScarletGridItem } from './scarlet-grid-item';

describe('scarlet-grid-item', () => {
  it('sets the col/row span custom properties from colSpan/rowSpan, defaulting to 1', async () => {
    const page = await newSpecPage({
      components: [ScarletGridItem],
      html: '<scarlet-grid-item></scarlet-grid-item>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span')).toBe('1');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span')).toBe('1');
  });

  it('applies a custom column and row span', async () => {
    const page = await newSpecPage({
      components: [ScarletGridItem],
      html: '<scarlet-grid-item col-span="3" row-span="2"></scarlet-grid-item>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span')).toBe('3');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span')).toBe('2');
  });

  it('only sets the breakpoint span custom properties that were actually passed', async () => {
    const page = await newSpecPage({
      components: [ScarletGridItem],
      html: '<scarlet-grid-item col-span="1" col-span-md="2" row-span-lg="3"></scarlet-grid-item>'
    });

    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span')).toBe('1');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span-md')).toBe('2');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span-sm')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span-lg')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-col-span-xl')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span-lg')).toBe('3');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span-sm')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span-md')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-grid-item-row-span-xl')).toBe('');
  });
});
