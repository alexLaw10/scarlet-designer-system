import { newSpecPage } from '@stencil/core/testing';
import { ScarletSkeleton } from './scarlet-skeleton';

describe('scarlet-skeleton', () => {
  it('is hidden from assistive tech', async () => {
    const page = await newSpecPage({
      components: [ScarletSkeleton],
      html: `<scarlet-skeleton></scarlet-skeleton>`,
    });

    expect(page.root?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders a single shape by default', async () => {
    const page = await newSpecPage({
      components: [ScarletSkeleton],
      html: `<scarlet-skeleton></scarlet-skeleton>`,
    });

    expect(page.root?.shadowRoot?.querySelectorAll('.scarlet-skeleton').length).toBe(1);
  });

  it('renders one shape per line when variant is text and lines > 1', async () => {
    const page = await newSpecPage({
      components: [ScarletSkeleton],
      html: `<scarlet-skeleton variant="text" lines="4"></scarlet-skeleton>`,
    });

    expect(page.root?.shadowRoot?.querySelectorAll('.scarlet-skeleton--text').length).toBe(4);
  });

  it('ignores lines for non-text variants', async () => {
    const page = await newSpecPage({
      components: [ScarletSkeleton],
      html: `<scarlet-skeleton variant="circle" lines="4"></scarlet-skeleton>`,
    });

    expect(page.root?.shadowRoot?.querySelectorAll('.scarlet-skeleton').length).toBe(1);
  });
});
