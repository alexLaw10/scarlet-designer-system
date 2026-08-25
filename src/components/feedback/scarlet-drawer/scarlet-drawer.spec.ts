import { newSpecPage } from '@stencil/core/testing';
import { ScarletDrawer } from './scarlet-drawer';

// jsdom's <dialog> support varies by version, so these methods are stubbed
// directly (plain assignment, not jest.spyOn) rather than relying on real
// native dialog behavior — we only need to verify our component calls them.
// Same technique scarlet-modal's own spec uses, since this component is
// built on the same native <dialog> mechanics.
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

describe('scarlet-drawer', () => {
  it('calls showModal() and emits scarletShow when open becomes true', async () => {
    const page = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
    });
    const dialog = stubDialog(page);
    const showSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);

    page.rootInstance.open = true;
    await page.waitForChanges();

    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(showSpy).toHaveBeenCalledTimes(1);
  });

  it('opens via the show() method and closes via hide(), emitting a cancelable scarletClose', async () => {
    const page = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
    });
    const dialog = stubDialog(page);

    await page.rootInstance.show();
    await page.waitForChanges();
    expect(dialog.showModal).toHaveBeenCalledTimes(1);

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
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
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
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
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

  it('closes on backdrop click but not on clicks inside the panel', async () => {
    const page = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
    });
    const dialog = stubDialog(page);
    Object.defineProperty(dialog, 'open', { value: true, configurable: true });
    page.rootInstance.open = true;
    await page.waitForChanges();

    const box = page.root?.shadowRoot?.querySelector('.scarlet-drawer__box') as HTMLElement;
    box.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(page.rootInstance.open).toBe(true);

    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await page.waitForChanges();
    expect(page.rootInstance.open).toBe(false);
  });

  it('labels the dialog via the header slot by default, and via aria-label when provided', async () => {
    const withHeader = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer><span slot="header">Filtros</span></scarlet-drawer>`,
    });
    const headerDialog = withHeader.root?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    const headerSpan = withHeader.root?.shadowRoot?.querySelector('.scarlet-drawer__header > span') as HTMLElement;
    expect(headerDialog.getAttribute('aria-labelledby')).toBe(headerSpan.id);

    const withAriaLabel = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer aria-label="Filtros de busca"></scarlet-drawer>`,
    });
    const labeledDialog = withAriaLabel.root?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    expect(labeledDialog.getAttribute('aria-label')).toBe('Filtros de busca');
  });

  it('defaults to the right placement and applies the placement/size classes', async () => {
    const page = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer placement="left" size="lg"></scarlet-drawer>`,
    });

    const dialog = page.root?.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    expect(dialog.classList.contains('scarlet-drawer--left')).toBe(true);
    expect(dialog.classList.contains('scarlet-drawer--lg')).toBe(true);
  });

  it('restores focus to the previously focused element when closed', async () => {
    const page = await newSpecPage({
      components: [ScarletDrawer],
      html: `<scarlet-drawer></scarlet-drawer>`,
    });
    stubDialog(page);

    const trigger = page.doc.createElement('button');
    page.body.appendChild(trigger);
    trigger.focus();
    expect(page.doc.activeElement).toBe(trigger);

    page.rootInstance.open = true;
    await page.waitForChanges();

    await page.rootInstance.hide();
    await page.waitForChanges();

    expect(page.doc.activeElement).toBe(trigger);
  });
});
