import { newSpecPage } from '@stencil/core/testing';
import { ScarletAvatar } from './scarlet-avatar';

describe('scarlet-avatar', () => {
  it('renders initials from the name when there is no src', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar name="Ana Souza"></scarlet-avatar>`,
    });

    const initials = page.root?.shadowRoot?.querySelector('.scarlet-avatar__initials');
    expect(initials?.textContent).toBe('AS');
    expect(page.root?.shadowRoot?.querySelector('img')).toBeNull();
  });

  it('uses only the first letter for a single-word name', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar name="Ana"></scarlet-avatar>`,
    });

    const initials = page.root?.shadowRoot?.querySelector('.scarlet-avatar__initials');
    expect(initials?.textContent).toBe('A');
  });

  it('renders the placeholder icon when there is neither src nor name', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar></scarlet-avatar>`,
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-avatar__placeholder')).not.toBeNull();
  });

  it('renders an image when src is provided', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar src="/ana.jpg" name="Ana Souza"></scarlet-avatar>`,
    });

    const img = page.root?.shadowRoot?.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toContain('/ana.jpg');
  });

  it('falls back to initials after the image fails to load', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar src="/broken.jpg" name="Ana Souza"></scarlet-avatar>`,
    });

    const img = page.root?.shadowRoot?.querySelector('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('img')).toBeNull();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-avatar__initials')?.textContent).toBe('AS');
  });

  it('sets aria-label from alt, falling back to name', async () => {
    const page = await newSpecPage({
      components: [ScarletAvatar],
      html: `<scarlet-avatar name="Ana Souza"></scarlet-avatar>`,
    });

    expect(page.root?.getAttribute('aria-label')).toBe('Ana Souza');
  });
});
