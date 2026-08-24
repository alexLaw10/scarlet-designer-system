import { newSpecPage } from '@stencil/core/testing';
import { ScarletModal } from './scarlet-modal';

// jsdom's <dialog> support varies by version, so these methods are stubbed
// directly (plain assignment, not jest.spyOn) rather than relying on real
// native dialog behavior — we only need to verify our component calls them.
function stubDialog(page: Awaited<ReturnType<typeof newSpecPage>>) {
  const dialog = page.root?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
  dialog.showModal = jest.fn(() => {
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
  });
  dialog.close = jest.fn(() => {
    Object.defineProperty(dialog, 'open', { value: false, configurable: true });
  });
  return dialog;
}

describe('scarlet-modal', () => {
  it('calls showModal() and emits scarletShow when loaded already open', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    page.rootInstance.open = true;

    const showSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);

    await page.rootInstance.componentDidLoad();
    await page.waitForChanges();

    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('opens via the show() method by setting open=true', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);

    await page.rootInstance.show();
    await page.waitForChanges();

    expect(page.rootInstance.open).toBe(true);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
  });

  it('closes via the hide() method, emitting a cancelable scarletClose', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    const closeSpy = jest.fn();
    page.root?.addEventListener('scarletClose', closeSpy);

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(page.rootInstance.open).toBe(false);
    expect(dialog.close).toHaveBeenCalledTimes(1);
  });

  it('stays open when a scarletClose listener calls preventDefault()', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    page.root?.addEventListener('scarletClose', (event) => event.preventDefault());

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(page.rootInstance.open).toBe(true);
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('prevents the native cancel default and requests close when dismissOnEsc is true', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    const cancelEvent = new Event('cancel', { cancelable: true });
    dialog.dispatchEvent(cancelEvent);
    await page.waitForChanges();

    expect(cancelEvent.defaultPrevented).toBe(true);
    expect(page.rootInstance.open).toBe(false);
  });

  it('does not close on cancel when dismissOnEsc is false', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal dismiss-on-esc="false"></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));
    await page.waitForChanges();

    expect(page.rootInstance.open).toBe(true);
  });

  it('closes on backdrop click but not on clicks inside the dialog box', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: `<scarlet-modal></scarlet-modal>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    const box = page.root?.shadowRoot?.querySelector('.scarlet-modal__box') as HTMLElement;
    box.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(page.rootInstance.open).toBe(true);

    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(page.rootInstance.open).toBe(false);
  });
});
