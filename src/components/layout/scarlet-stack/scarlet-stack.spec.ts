import { newSpecPage } from '@stencil/core/testing';
import { ScarletStack } from './scarlet-stack';

describe('scarlet-stack', () => {
  it('defaults to column direction, md gap, stretch align, start justify, nowrap', async () => {
    const page = await newSpecPage({
      components: [ScarletStack],
      html: `<scarlet-stack></scarlet-stack>`,
    });

    expect(page.root?.classList.contains('scarlet-stack-host--column')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--gap-md')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--align-stretch')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--justify-start')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--wrap-nowrap')).toBe(true);
  });

  it('applies every overridden prop as a host class', async () => {
    const page = await newSpecPage({
      components: [ScarletStack],
      html: `<scarlet-stack direction="row" gap="xl" align="center" justify="between" wrap="wrap"></scarlet-stack>`,
    });

    expect(page.root?.classList.contains('scarlet-stack-host--row')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--gap-xl')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--align-center')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--justify-between')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--wrap-wrap')).toBe(true);
  });
});
