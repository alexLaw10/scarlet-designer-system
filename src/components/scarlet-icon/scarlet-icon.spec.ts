import { newSpecPage } from '@stencil/core/testing';
import { ScarletIcon } from './scarlet-icon';
import { scarletIconNames } from './icons';

describe('scarlet-icon', () => {
  it('renders an svg with the shared stroke conventions for a known name', async () => {
    const page = await newSpecPage({
      components: [ScarletIcon],
      html: `<scarlet-icon name="check"></scarlet-icon>`,
    });

    const svg = page.root?.shadowRoot?.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg?.querySelector('polyline')).not.toBeNull();
  });

  it('is aria-hidden and has no role when no label is given', async () => {
    const page = await newSpecPage({
      components: [ScarletIcon],
      html: `<scarlet-icon name="check"></scarlet-icon>`,
    });

    expect(page.root?.getAttribute('aria-hidden')).toBe('true');
    expect(page.root?.getAttribute('role')).toBeNull();
  });

  it('exposes role="img" and aria-label when a label is given', async () => {
    const page = await newSpecPage({
      components: [ScarletIcon],
      html: `<scarlet-icon name="trash" label="Excluir"></scarlet-icon>`,
    });

    expect(page.root?.getAttribute('role')).toBe('img');
    expect(page.root?.getAttribute('aria-label')).toBe('Excluir');
    expect(page.root?.getAttribute('aria-hidden')).toBeNull();
  });

  it('falls back to the default slot when name is unrecognized or omitted', async () => {
    const page = await newSpecPage({
      components: [ScarletIcon],
      html: `<scarlet-icon><svg viewBox="0 0 24 24"><rect width="24" height="24" /></svg></scarlet-icon>`,
    });

    expect(page.root?.shadowRoot?.querySelector('svg.scarlet-icon')).toBeNull();
    expect(page.root?.shadowRoot?.querySelector('slot')).not.toBeNull();
  });

  it('renders a non-empty svg for every icon in the registry', async () => {
    for (const name of scarletIconNames) {
      const page = await newSpecPage({
        components: [ScarletIcon],
        html: `<scarlet-icon name="${name}"></scarlet-icon>`,
      });
      const svg = page.root?.shadowRoot?.querySelector('svg');
      expect(svg?.children.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('applies a custom size as inline width/height', async () => {
    const page = await newSpecPage({
      components: [ScarletIcon],
      html: `<scarlet-icon name="check" size="32px"></scarlet-icon>`,
    });

    expect(page.root?.style.width).toBe('32px');
    expect(page.root?.style.height).toBe('32px');
  });
});
