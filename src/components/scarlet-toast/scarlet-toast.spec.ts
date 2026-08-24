import { newSpecPage } from '@stencil/core/testing';
import { ScarletToast } from './scarlet-toast';

describe('scarlet-toast', () => {
  it('renders open by default with role="status"', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: `<scarlet-toast duration="0">Mensagem</scarlet-toast>`,
    });

    expect(page.root?.getAttribute('role')).toBe('status');
    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();
  });

  it('auto-dismisses after the given duration and emits scarletDismiss', async () => {
    jest.useFakeTimers();
    const page = await newSpecPage({
      components: [ScarletToast],
      html: `<scarlet-toast duration="1000">Mensagem</scarlet-toast>`,
    });

    const dismissSpy = jest.fn();
    page.root?.addEventListener('scarletDismiss', dismissSpy);

    jest.advanceTimersByTime(1000);
    await page.waitForChanges();

    expect(dismissSpy).toHaveBeenCalledTimes(1);
    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).toBeNull();

    jest.useRealTimers();
  });

  it('does not auto-dismiss when duration is 0', async () => {
    jest.useFakeTimers();
    const page = await newSpecPage({
      components: [ScarletToast],
      html: `<scarlet-toast duration="0">Mensagem</scarlet-toast>`,
    });

    jest.advanceTimersByTime(60000);
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();

    jest.useRealTimers();
  });

  it('dismisses via the close button and stays open when the event is prevented', async () => {
    const page = await newSpecPage({
      components: [ScarletToast],
      html: `<scarlet-toast duration="0">Mensagem</scarlet-toast>`,
    });

    page.root?.addEventListener('scarletDismiss', (event) => event.preventDefault());

    const button = page.root?.shadowRoot?.querySelector('.scarlet-toast__dismiss') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-toast__content')).not.toBeNull();
  });
});
