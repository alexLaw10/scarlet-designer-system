import { newSpecPage } from '@stencil/core/testing';
import { ScarletCard } from './scarlet-card';

describe('scarlet-card', () => {
  it('renders the elevated variant by default, not interactive', async () => {
    const page = await newSpecPage({
      components: [ScarletCard],
      html: `<scarlet-card></scarlet-card>`,
    });

    expect(page.root?.classList.contains('scarlet-card-host--elevated')).toBe(true);
    expect(page.root?.getAttribute('role')).toBeNull();
    expect(page.root?.getAttribute('tabindex')).toBeNull();
  });

  it('adds role="button" and tabindex when interactive', async () => {
    const page = await newSpecPage({
      components: [ScarletCard],
      html: `<scarlet-card interactive></scarlet-card>`,
    });

    expect(page.root?.getAttribute('role')).toBe('button');
    expect(page.root?.getAttribute('tabindex')).toBe('0');
  });

  it('emits scarletClick on click only when interactive', async () => {
    const page = await newSpecPage({
      components: [ScarletCard],
      html: `<scarlet-card></scarlet-card>`,
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('scarletClick', clickSpy);
    page.root?.click();
    await page.waitForChanges();

    expect(clickSpy).not.toHaveBeenCalled();

    page.root?.setAttribute('interactive', '');
    await page.waitForChanges();
    page.root?.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('emits scarletClick on Enter/Space when interactive', async () => {
    const page = await newSpecPage({
      components: [ScarletCard],
      html: `<scarlet-card interactive></scarlet-card>`,
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('scarletClick', clickSpy);

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(2);
  });

  it('applies the requested padding modifier to the body', async () => {
    const page = await newSpecPage({
      components: [ScarletCard],
      html: `<scarlet-card padding="lg"></scarlet-card>`,
    });

    const body = page.root?.shadowRoot?.querySelector('.scarlet-card__body');
    expect(body?.classList.contains('scarlet-card__body--lg')).toBe(true);
  });
});
