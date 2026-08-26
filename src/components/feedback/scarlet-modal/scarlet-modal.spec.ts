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
  it('calls showModal() and emits scarletShow when open becomes true', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal></scarlet-modal>'
    });
    const dialog = stubDialog(page);

    // Listener must be attached before the state change: setting `open`
    // triggers @Watch('open') synchronously, which is what actually opens
    // the dialog and emits scarletShow here (not the componentDidLoad path,
    // which only matters when the component starts out already open).
    const showSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);

    page.rootInstance.open = true;
    await page.waitForChanges();

    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('opens via the show() method by setting open=true', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal></scarlet-modal>'
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
      html: '<scarlet-modal></scarlet-modal>'
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
      html: '<scarlet-modal></scarlet-modal>'
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    page.root?.addEventListener('scarletClose', event => event.preventDefault());

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(page.rootInstance.open).toBe(true);
    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('prevents the native cancel default and requests close when dismissOnEsc is true', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal></scarlet-modal>'
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
      html: '<scarlet-modal dismiss-on-esc="false"></scarlet-modal>'
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
      html: '<scarlet-modal></scarlet-modal>'
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

  it('labels the dialog via the header slot by default, and via aria-label when provided', async () => {
    const withHeader = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal><span slot="header">Confirmar</span></scarlet-modal>'
    });
    const headerDialog = withHeader.root?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    const headerSpan = withHeader.root?.shadowRoot?.querySelector(
      '.scarlet-modal__header > span'
    ) as HTMLElement;
    expect(headerDialog.getAttribute('aria-labelledby')).toBe(headerSpan.id);
    expect(headerDialog.hasAttribute('aria-label')).toBe(false);

    const withAriaLabel = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal aria-label="Confirmar exclusão"><span slot="header">Ignorado</span></scarlet-modal>'
    });
    const labeledDialog = withAriaLabel.root?.shadowRoot?.querySelector(
      'dialog'
    ) as HTMLDialogElement;
    expect(labeledDialog.getAttribute('aria-label')).toBe('Confirmar exclusão');
    expect(labeledDialog.hasAttribute('aria-labelledby')).toBe(false);
  });

  it('renders footer-start and footer-end as independent slots, each in its own flex group', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal></scarlet-modal>'
    });

    const startSlot = page.root?.shadowRoot?.querySelector(
      '.scarlet-modal__footer-group--start slot[name="footer-start"]'
    );
    const endSlot = page.root?.shadowRoot?.querySelector(
      '.scarlet-modal__footer-group--end slot[name="footer-end"]'
    );
    expect(startSlot).not.toBeNull();
    expect(endSlot).not.toBeNull();
  });

  it('restores focus to the previously focused element when closed', async () => {
    const page = await newSpecPage({
      components: [ScarletModal],
      html: '<scarlet-modal></scarlet-modal>'
    });
    stubDialog(page);

    // mock-doc's `.focus()` only dispatches a `focus` event — it never
    // updates `document.activeElement` (there's no tracking of it at all),
    // so we stub a live `activeElement` here and route it through the
    // trigger's own `.focus()`, the same way `stubDialog` above stands in
    // for native <dialog> behavior mock-doc doesn't implement either.
    const trigger = page.doc.createElement('button');
    page.body.appendChild(trigger);
    let currentActiveElement: Element | undefined;
    Object.defineProperty(page.doc, 'activeElement', {
      get: () => currentActiveElement ?? null,
      configurable: true
    });
    const focusSpy = jest.fn(() => {
      currentActiveElement = trigger;
    });
    trigger.focus = focusSpy;

    trigger.focus();
    expect(page.doc.activeElement).toBe(trigger);

    page.rootInstance.open = true;
    await page.waitForChanges();

    // Simulate the dialog stealing focus away from the trigger, the way a
    // real `showModal()` would.
    currentActiveElement = undefined;
    focusSpy.mockClear();

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(page.doc.activeElement).toBe(trigger);
  });
});
