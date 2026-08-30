import { newSpecPage } from '@stencil/core/testing';
import { ScarletBadge } from './scarlet-badge';

describe('scarlet-badge', () => {
  it('renders solid/primary/sm by default with its slotted content', async () => {
    const page = await newSpecPage({
      components: [ScarletBadge],
      html: '<scarlet-badge>Novo</scarlet-badge>'
    });

    expect(page.root?.classList.contains('scarlet-badge-host--solid')).toBe(true);
    expect(page.root?.classList.contains('scarlet-badge-host--primary')).toBe(true);
    expect(page.root?.classList.contains('scarlet-badge-host--sm')).toBe(true);
    expect(page.root?.textContent?.trim()).toBe('Novo');
  });

  it('omits the slot and adds the dot modifier when dot=true', async () => {
    const page = await newSpecPage({
      components: [ScarletBadge],
      html: '<scarlet-badge dot>Novo</scarlet-badge>'
    });

    expect(page.root?.classList.contains('scarlet-badge-host--dot')).toBe(true);
    expect(page.root?.shadowRoot?.querySelector('slot')).toBeNull();
  });

  it('applies the requested variant and color classes', async () => {
    const page = await newSpecPage({
      components: [ScarletBadge],
      html: '<scarlet-badge variant="outline" color="error"></scarlet-badge>'
    });

    expect(page.root?.classList.contains('scarlet-badge-host--outline')).toBe(true);
    expect(page.root?.classList.contains('scarlet-badge-host--error')).toBe(true);
  });
});
