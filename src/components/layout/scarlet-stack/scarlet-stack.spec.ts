import { newSpecPage } from '@stencil/core/testing';
import { ScarletStack } from './scarlet-stack';

describe('scarlet-stack', () => {
  it('defaults to column direction, md gap, stretch align, start justify, nowrap', async () => {
    const page = await newSpecPage({
      components: [ScarletStack],
      html: `<scarlet-stack></scarlet-stack>`,
    });

    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction')).toBe('column');
    expect(page.root?.classList.contains('scarlet-stack-host--gap-md')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--align-stretch')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--justify-start')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--wrap-nowrap')).toBe(true);
  });

  it('applies every overridden prop', async () => {
    const page = await newSpecPage({
      components: [ScarletStack],
      html: `<scarlet-stack direction="row" gap="xl" align="center" justify="between" wrap="wrap"></scarlet-stack>`,
    });

    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction')).toBe('row');
    expect(page.root?.classList.contains('scarlet-stack-host--gap-xl')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--align-center')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--justify-between')).toBe(true);
    expect(page.root?.classList.contains('scarlet-stack-host--wrap-wrap')).toBe(true);
  });

  it('only sets the breakpoint direction custom properties that were actually passed', async () => {
    const page = await newSpecPage({
      components: [ScarletStack],
      html: `<scarlet-stack direction="column" direction-md="row"></scarlet-stack>`,
    });

    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction')).toBe('column');
    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction-md')).toBe('row');
    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction-sm')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction-lg')).toBe('');
    expect(page.root?.style.getPropertyValue('--scarlet-stack-direction-xl')).toBe('');
  });
});
