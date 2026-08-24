import { newSpecPage } from '@stencil/core/testing';
import { ScarletTooltip } from './scarlet-tooltip';

describe('scarlet-tooltip', () => {
  it('is hidden by default', async () => {
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: `<scarlet-tooltip content="Dica">Trigger</scarlet-tooltip>`,
    });

    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);
    expect(page.root?.getAttribute('aria-describedby')).toBeNull();
  });

  it('shows after the delay on mouseover and emits scarletShow', async () => {
    jest.useFakeTimers();
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: `<scarlet-tooltip content="Dica" delay="100">Trigger</scarlet-tooltip>`,
    });

    const showSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    jest.advanceTimersByTime(100);
    await page.waitForChanges();

    expect(showSpy).toHaveBeenCalledTimes(1);
    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(true);
    expect(page.root?.getAttribute('aria-describedby')).toBe(tooltip?.id ?? null);

    jest.useRealTimers();
  });

  it('hides on mouseout and emits scarletHide', async () => {
    jest.useFakeTimers();
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: `<scarlet-tooltip content="Dica" delay="0">Trigger</scarlet-tooltip>`,
    });

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    jest.advanceTimersByTime(0);
    await page.waitForChanges();

    const hideSpy = jest.fn();
    page.root?.addEventListener('scarletHide', hideSpy);

    page.root?.dispatchEvent(new Event('mouseout', { bubbles: true }));
    await page.waitForChanges();

    expect(hideSpy).toHaveBeenCalledTimes(1);
    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);

    jest.useRealTimers();
  });

  it('never shows when disabled', async () => {
    jest.useFakeTimers();
    const page = await newSpecPage({
      components: [ScarletTooltip],
      html: `<scarlet-tooltip content="Dica" delay="0" disabled>Trigger</scarlet-tooltip>`,
    });

    page.root?.dispatchEvent(new Event('mouseover', { bubbles: true }));
    jest.advanceTimersByTime(0);
    await page.waitForChanges();

    const tooltip = page.root?.shadowRoot?.querySelector('.scarlet-tooltip');
    expect(tooltip?.classList.contains('scarlet-tooltip--visible')).toBe(false);

    jest.useRealTimers();
  });
});
