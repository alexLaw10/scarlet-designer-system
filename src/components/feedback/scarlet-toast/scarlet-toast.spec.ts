import { newSpecPage } from '@stencil/core/testing';
import { ScarletToast } from './scarlet-toast';

// Real (short) timers are used instead of jest.useFakeTimers()/advanceTimersByTime():
// Stencil's newSpecPage relies on its own internal scheduling for
// waitForChanges(), and mixing that with Jest's fake timers reliably hangs
// the test until the suite timeout — and, worse, leaks into later tests if
// the hang happens before jest.useRealTimers() is reached.
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('scarlet-toast', () => {
  it('renders open by default with role="status"', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: '<scarlet-toast duration="0">Mensagem</scarlet-toast>'
    });

    expect(page.root?.getAttribute('role')).toBe('status');
    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();
  });

  it('auto-dismisses after the given duration and emits scarletDismiss', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: '<scarlet-toast duration="30">Mensagem</scarlet-toast>'
    });

    const dismissSpy = jest.fn();
    page.root?.addEventListener('scarletDismiss', dismissSpy);

    await wait(60);
    await page.waitForChanges();

    expect(dismissSpy).toHaveBeenCalledTimes(1);
    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).toBeNull();
  });

  it('does not auto-dismiss when duration is 0', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: '<scarlet-toast duration="0">Mensagem</scarlet-toast>'
    });

    await wait(60);
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();
  });

  it('dismisses via the close button and stays open when the event is prevented', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: '<scarlet-toast duration="0">Mensagem</scarlet-toast>'
    });

    page.root?.addEventListener('scarletDismiss', event => event.preventDefault());

    const button = page.root?.shadowRoot?.querySelector(
      '.scarlet-toast__dismiss'
    ) as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();
  });
});
