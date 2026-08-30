import { newSpecPage } from '@stencil/core/testing';
import { ScarletEmptyState } from './scarlet-empty-state';

describe('scarlet-empty-state', () => {
  it('renders the default heading and no description when unset', async () => {
    const page = await newSpecPage({
      components: [ScarletEmptyState],
      html: '<scarlet-empty-state></scarlet-empty-state>'
    });

    const heading = page.root?.shadowRoot?.querySelector('.scarlet-empty-state__heading');
    expect(heading?.textContent?.trim()).toBe('Nenhum resultado encontrado.');
    expect(page.root?.shadowRoot?.querySelector('.scarlet-empty-state__description')).toBeNull();
  });

  it('renders a custom heading and description', async () => {
    const page = await newSpecPage({
      components: [ScarletEmptyState],
      html: '<scarlet-empty-state heading="Nada por aqui" description="Crie o primeiro item."></scarlet-empty-state>'
    });

    expect(
      page.root?.shadowRoot?.querySelector('.scarlet-empty-state__heading')?.textContent?.trim()
    ).toBe('Nada por aqui');
    expect(
      page.root?.shadowRoot?.querySelector('.scarlet-empty-state__description')?.textContent?.trim()
    ).toBe('Crie o primeiro item.');
  });

  it('renders the fallback icon from the icon prop when no icon slot content is provided', async () => {
    const page = await newSpecPage({
      components: [ScarletEmptyState],
      html: '<scarlet-empty-state icon="search"></scarlet-empty-state>'
    });

    const icon = page.root?.shadowRoot?.querySelector('.scarlet-empty-state__icon');
    expect(icon?.tagName.toLowerCase()).toBe('scarlet-icon');
  });

  it('renders slotted action content', async () => {
    const page = await newSpecPage({
      components: [ScarletEmptyState],
      html: '<scarlet-empty-state><button slot="action">Tentar de novo</button></scarlet-empty-state>'
    });

    const action = page.root?.querySelector('[slot="action"]');
    expect(action?.textContent?.trim()).toBe('Tentar de novo');
  });
});
