import { newSpecPage } from '@stencil/core/testing';
import { ScarletTooltip } from './scarlet-tooltip';

// Real (short) timers are used instead of jest.useFakeTimers()/advanceTimersByTime():
// Stencil's newSpecPage relies on its own internal scheduling for
// waitForChanges(), and mixing that with Jest's fake timers reliably hangs
// the test until the suite timeout — and, worse, leaks into later tests if
// the hang happens before jest.useRealTimers() is reached.
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('scarlet-tooltip', () => {
  it('is hidden by default', async () => {
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: '<scarlet-tooltip content="Dica">Trigger</scarlet-tooltip>'
    });

    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);
    expect(page.root?.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows after the delay on mouseover and emits scarletShow', async () => {
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: '<scarlet-tooltip content="Dica" delay="20">Trigger</scarlet-tooltip>'
    });

    const showSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    await wait(50);
    await page.waitForChanges();

    expect(showSpy).toHaveBeenCalledTimes(1);
    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(true);
    expect(page.root?.getAttribute('aria-describedby')).toBe(tooltip?.id ?? null);
  });

  it('hides on mouseout and emits scarletHide', async () => {
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: '<scarlet-tooltip content="Dica" delay="0">Trigger</scarlet-tooltip>'
    });

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    await wait(20);
    await page.waitForChanges();

    const hideSpy = jest.fn();
    page.root?.addEventListener('scarletHide', hideSpy);

    page.root?.dispatchEvent(new Event('mouseout', { bubbles: true }));
    await page.waitForChanges();

    expect(hideSpy).toHaveBeenCalledTimes(1);
    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);
  });

  it('never shows when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: '<scarlet-tooltip content="Dica" delay="0" disabled>Trigger</scarlet-tooltip>'
    });

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    await wait(20);
    await page.waitForChanges();

    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);
  });
});
