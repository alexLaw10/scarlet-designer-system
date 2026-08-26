import { newSpecPage } from '@stencil/core/testing';
import { ScarletCopy } from './scarlet-copy';

// Real (short) timers, not jest.useFakeTimers()/advanceTimersByTime(): mixing
// those with newSpecPage's own internal scheduling for waitForChanges()
// reliably hangs the test — see scarlet-toast's spec for the same note.
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// mock-doc's `page.win`/`page.doc` are their own separate window/document —
// distinct from the real jsdom globals — with a `page.win.navigator` that's
// a plain `MockNavigator` with no `clipboard` property at all, and no
// `execCommand` on `page.doc` either. Both of the component's own clipboard
// strategies need to be stubbed there, not on the bare `navigator`/`document`
// globals, since the component reads them via `this.el.ownerDocument` (the
// same fix `scarlet-modal`'s focus handling needed for `document`).
function stubModernClipboard(win: Window): jest.Mock {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(win.navigator, 'clipboard', {
    value: { writeText },
    configurable: true
  });
  return writeText;
}

function stubExecCommand(doc: Document, result: boolean): jest.Mock {
  const execCommand = jest.fn().mockReturnValue(result);
  Object.defineProperty(doc, 'execCommand', { value: execCommand, configurable: true });
  // mock-doc's <textarea> doesn't implement `.select()` at all (unlike a
  // real one, where it's always present) — stub it on the prototype so the
  // component's own offscreen-textarea-then-select-then-execCommand
  // sequence can run past that line instead of throwing.
  const proto = Object.getPrototypeOf(doc.createElement('textarea'));
  proto.select = jest.fn();
  return execCommand;
}

describe('scarlet-copy', () => {
  it('copies value via the Clipboard API on click and shows the copied state', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="olá mundo"></scarlet-copy>'
    });
    const writeText = stubModernClipboard(page.win);
    const copySpy = jest.fn();
    page.root?.addEventListener('scarletCopy', copySpy);

    const button = page.root!.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await Promise.resolve();
    await Promise.resolve();
    await page.waitForChanges();

    expect(writeText).toHaveBeenCalledWith('olá mundo');
    expect(copySpy).toHaveBeenCalledTimes(1);
    expect(copySpy.mock.calls[0][0].detail).toBe('olá mundo');
    expect(button.classList.contains('scarlet-copy--copied')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Copiado!');
  });

  it('reverts to the idle state after resetAfter', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="x" reset-after="30"></scarlet-copy>'
    });
    stubModernClipboard(page.win);

    const button = page.root!.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await Promise.resolve();
    await Promise.resolve();
    await page.waitForChanges();
    expect(button.classList.contains('scarlet-copy--copied')).toBe(true);

    await wait(60);
    await page.waitForChanges();

    expect(button.classList.contains('scarlet-copy--copied')).toBe(false);
    expect(button.getAttribute('aria-label')).toBe('Copiar');
  });

  it('falls back to execCommand when the Clipboard API is unavailable', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="x"></scarlet-copy>'
    });
    const execCommand = stubExecCommand(page.doc, true);

    const button = page.root!.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await Promise.resolve();
    await Promise.resolve();
    await page.waitForChanges();

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(button.classList.contains('scarlet-copy--copied')).toBe(true);
  });

  it('shows the error state and emits scarletCopyError when both copy strategies fail', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="x"></scarlet-copy>'
    });
    stubExecCommand(page.doc, false);
    const errorSpy = jest.fn();
    page.root?.addEventListener('scarletCopyError', errorSpy);

    const button = page.root!.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await Promise.resolve();
    await Promise.resolve();
    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(button.classList.contains('scarlet-copy--error')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Não foi possível copiar');
  });

  it('does nothing when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="x" disabled></scarlet-copy>'
    });
    const writeText = stubModernClipboard(page.win);

    const button = page.root!.shadowRoot!.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(writeText).not.toHaveBeenCalled();
  });

  it('copies via the copy() method the same way a click would', async () => {
    const page = await newSpecPage({
      components: [ScarletCopy],
      html: '<scarlet-copy value="via method"></scarlet-copy>'
    });
    const writeText = stubModernClipboard(page.win);

    await page.rootInstance.copy();
    await page.waitForChanges();

    expect(writeText).toHaveBeenCalledWith('via method');
  });
});
