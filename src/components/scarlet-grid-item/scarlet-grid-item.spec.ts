import { newSpecPage } from '@stencil/core/testing';
import { ScarletGridItem } from './scarlet-grid-item';

describe('scarlet-grid-item', () => {
  it('spans a single column and row by default', async () => {
    const page = await newSpecPage({
      components: [ScarletGridItem],
      html: `<scarlet-grid-item></scarlet-grid-item>`,
    });

    expect(page.root?.style.gridColumn).toBe('span 1 / span 1');
    expect(page.root?.style.gridRow).toBe('span 1 / span 1');
  });

  it('spans the requested number of columns and rows', async () => {
    const page = await newSpecPage({
      components: [ScarletGridItem],
      html: `<scarlet-grid-item col-span="3" row-span="2"></scarlet-grid-item>`,
    });

    expect(page.root?.style.gridColumn).toBe('span 3 / span 3');
    expect(page.root?.style.gridRow).toBe('span 2 / span 2');
  });
});
