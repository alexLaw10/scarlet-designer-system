import { newSpecPage } from '@stencil/core/testing';
import { ScarletLink } from './scarlet-link';

describe('scarlet-link', () => {
  it('renders href on the internal anchor', async () => {
    const page = await newSpecPage({
      components: [ScarletLink],
      html: '<scarlet-link href="/produtos">Produtos</scarlet-link>'
    });

    const anchor = page.root?.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/produtos');
  });

  it('adds rel="noopener noreferrer" by default when target is _blank', async () => {
    const page = await newSpecPage({
      components: [ScarletLink],
      html: '<scarlet-link href="https://example.com" target="_blank">Externo</scarlet-link>'
    });

    const anchor = page.root?.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('lets an explicit rel override the _blank default', async () => {
    const page = await newSpecPage({
      components: [ScarletLink],
      html: '<scarlet-link href="https://example.com" target="_blank" rel="me">Externo</scarlet-link>'
    });

    const anchor = page.root?.shadowRoot?.querySelector('a');
    expect(anchor?.getAttribute('rel')).toBe('me');
  });

  it('drops href and marks aria-disabled when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletLink],
      html: '<scarlet-link href="/produtos" disabled>Produtos</scarlet-link>'
    });

    const anchor = page.root?.shadowRoot?.querySelector('a');
    expect(anchor?.hasAttribute('href')).toBe(false);
    expect(anchor?.getAttribute('aria-disabled')).toBe('true');
  });
});
