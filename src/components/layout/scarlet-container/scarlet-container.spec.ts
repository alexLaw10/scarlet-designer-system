import { newSpecPage } from '@stencil/core/testing';
import { ScarletContainer } from './scarlet-container';

describe('scarlet-container', () => {
  it('defaults to maxWidth lg, with padding and centering on', async () => {
    const page = await newSpecPage({
      components: [ScarletContainer],
      html: `<scarlet-container></scarlet-container>`,
    });

    expect(page.root?.classList.contains('scarlet-container-host--lg')).toBe(true);
    expect(page.root?.classList.contains('scarlet-container-host--padding')).toBe(true);
    expect(page.root?.classList.contains('scarlet-container-host--center')).toBe(true);
  });

  it('applies a custom maxWidth', async () => {
    const page = await newSpecPage({
      components: [ScarletContainer],
      html: `<scarlet-container max-width="sm"></scarlet-container>`,
    });

    expect(page.root?.classList.contains('scarlet-container-host--sm')).toBe(true);
    expect(page.root?.classList.contains('scarlet-container-host--lg')).toBe(false);
  });

  it('omits padding/center classes when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletContainer],
      html: `<scarlet-container padding="false" center="false"></scarlet-container>`,
    });

    expect(page.root?.classList.contains('scarlet-container-host--padding')).toBe(false);
    expect(page.root?.classList.contains('scarlet-container-host--center')).toBe(false);
  });
});
