import { newSpecPage } from '@stencil/core/testing';
import { ScarletSpinner } from './scarlet-spinner';

describe('scarlet-spinner', () => {
  it('exposes role="status" with label as the accessible name', async () => {
    const page = await newSpecPage({
      components: [ScarletSpinner],
      html: '<scarlet-spinner label="Carregando pedidos"></scarlet-spinner>'
    });

    expect(page.root?.getAttribute('role')).toBe('status');
    expect(page.root?.getAttribute('aria-label')).toBe('Carregando pedidos');
  });

  it('renders the circle span by default', async () => {
    const page = await newSpecPage({
      components: [ScarletSpinner],
      html: '<scarlet-spinner></scarlet-spinner>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-spinner__circle')).not.toBeNull();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-spinner__logo')).toBeNull();
  });

  it('renders the logo svg when variant is logo', async () => {
    const page = await newSpecPage({
      components: [ScarletSpinner],
      html: '<scarlet-spinner variant="logo"></scarlet-spinner>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-spinner__logo')).not.toBeNull();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-spinner__circle')).toBeNull();
  });

  it('applies the size host class', async () => {
    const page = await newSpecPage({
      components: [ScarletSpinner],
      html: '<scarlet-spinner size="lg"></scarlet-spinner>'
    });

    expect(page.root?.classList.contains('scarlet-spinner-host--lg')).toBe(true);
  });
});
