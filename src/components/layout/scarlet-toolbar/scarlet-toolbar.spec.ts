import { newSpecPage } from '@stencil/core/testing';
import { ScarletToolbar } from './scarlet-toolbar';

describe('scarlet-toolbar', () => {
  it('exposes role="toolbar" with the given aria-label', async () => {
    const page = await newSpecPage({
      components: [ScarletToolbar],
      html: `<scarlet-toolbar aria-label="Ações"></scarlet-toolbar>`,
    });

    expect(page.root?.getAttribute('role')).toBe('toolbar');
    expect(page.root?.getAttribute('aria-label')).toBe('Ações');
  });

  it('defaults to justify-start', async () => {
    const page = await newSpecPage({
      components: [ScarletToolbar],
      html: `<scarlet-toolbar></scarlet-toolbar>`,
    });

    expect(page.root?.classList.contains('scarlet-toolbar-host--justify-start')).toBe(true);
  });

  it('reflects a custom justify value', async () => {
    const page = await newSpecPage({
      components: [ScarletToolbar],
      html: `<scarlet-toolbar justify="between"></scarlet-toolbar>`,
    });

    expect(page.root?.classList.contains('scarlet-toolbar-host--justify-between')).toBe(true);
  });
});
