import { Component, Prop, State, Event, type EventEmitter, h, Host, Method, Element } from '@stencil/core';
import type { Size } from '@/types';

export type ScarletCopyStatus = 'idle' | 'copied' | 'error';

/**
 * A small icon button that copies `value` to the clipboard on click,
 * showing a brief "Copiado!" (or error) bubble and swapping its icon to a
 * checkmark before reverting automatically.
 *
 * Uses the async Clipboard API (`navigator.clipboard.writeText`) when
 * available, falling back to a hidden `<textarea>` + `document.execCommand`
 * for non-secure contexts (plain HTTP, some older browsers) where the
 * Clipboard API doesn't exist at all.
 *
 * `scarletCopy`/`scarletCopyError` fire on the outcome either way — listen
 * there instead of the visual feedback alone if the app needs to react to
 * a failed copy (e.g. logging it).
 */
@Component({
  tag: 'scarlet-copy',
  styleUrl: 'scarlet-copy.scss',
  shadow: true
})
export class ScarletCopy {
  // Routed through this.el's own document/window, not the bare globals —
  // Stencil's mock-doc test environment provides its own separate
  // `navigator`/`document` (page.win.navigator, page.doc), which bare
  // `navigator`/`document` references wouldn't see at all in tests, the
  // same gap `scarlet-modal`'s focus handling had with `document`.
  @Element() el!: HTMLElement;

  private resetTimeoutId?: ReturnType<typeof setTimeout>;

  /** The text copied to the clipboard on click. */
  @Prop() readonly value = '';

  /** Accessible label for the button in its resting state. */
  @Prop() readonly label = 'Copiar';

  /** Label (both visible bubble text and accessible label) shown right after a successful copy. */
  @Prop() readonly copiedLabel = 'Copiado!';

  /** Label (both visible bubble text and accessible label) shown after a failed copy. */
  @Prop() readonly errorLabel = 'Não foi possível copiar';

  /** How long the copied/error state stays before reverting to idle, in milliseconds. */
  @Prop() readonly resetAfter = 2000;

  /** Size of the button. */
  @Prop() readonly size: Size = 'md';

  /** Disables the button. */
  @Prop() readonly disabled = false;

  @State() private status: ScarletCopyStatus = 'idle';

  /** Emitted with the copied value after a successful copy. */
  @Event() scarletCopy!: EventEmitter<string>;

  /** Emitted with the underlying error after a failed copy attempt. */
  @Event() scarletCopyError!: EventEmitter<Error>;

  disconnectedCallback(): void {
    this.clearResetTimeout();
  }

  /** Copies `value` to the clipboard, exactly as if the button had been clicked. */
  @Method()
  async copy(): Promise<void> {
    await this.performCopy();
  }

  private clearResetTimeout(): void {
    if (this.resetTimeoutId !== undefined) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = undefined;
    }
  }

  private scheduleReset(): void {
    this.clearResetTimeout();
    this.resetTimeoutId = setTimeout(() => {
      this.status = 'idle';
    }, this.resetAfter);
  }

  private writeToClipboard(text: string): Promise<void> {
    const doc = this.el.ownerDocument;
    const win = doc.defaultView;
    if (win?.navigator.clipboard?.writeText) {
      return win.navigator.clipboard.writeText(text);
    }
    // Non-secure context (plain HTTP) or an older browser: the async
    // Clipboard API doesn't exist at all there. `execCommand('copy')` only
    // works on an actual text selection, so a temporary offscreen
    // <textarea> stands in for one. The whole sequence (not just
    // `execCommand` itself) is one try/catch: any of these DOM calls could
    // throw depending on the environment (e.g. a very locked-down CSP).
    return new Promise((resolve, reject) => {
      const textarea = doc.createElement('textarea');
      try {
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '0';
        textarea.style.left = '-9999px';
        doc.body.appendChild(textarea);
        textarea.select();
        const succeeded = doc.execCommand('copy');
        if (succeeded) {
          resolve();
        } else {
          reject(new Error('execCommand("copy") failed'));
        }
      } catch (error) {
        reject(error as Error);
      } finally {
        textarea.remove();
      }
    });
  }

  private performCopy = async (): Promise<void> => {
    if (this.disabled) return;
    try {
      await this.writeToClipboard(this.value);
      this.status = 'copied';
      this.scarletCopy.emit(this.value);
    } catch (error) {
      this.status = 'error';
      this.scarletCopyError.emit(error as Error);
    }
    this.scheduleReset();
  };

  render() {
    const icon = this.status === 'copied' ? 'check' : this.status === 'error' ? 'x' : 'copy';
    const accessibleLabel =
      this.status === 'copied' ? this.copiedLabel : this.status === 'error' ? this.errorLabel : this.label;

    return (
      <Host class='scarlet-copy-host'>
        <button
          type='button'
          class={{
            'scarlet-copy': true,
            [`scarlet-copy--${this.size}`]: true,
            'scarlet-copy--copied': this.status === 'copied',
            'scarlet-copy--error': this.status === 'error'
          }}
          disabled={this.disabled}
          aria-label={accessibleLabel}
          onClick={this.performCopy}
        >
          <scarlet-icon name={icon} size='1em' />
        </button>
        <span
          class={{
            'scarlet-copy__bubble': true,
            'scarlet-copy__bubble--visible': this.status !== 'idle'
          }}
          role='status'
          aria-live='polite'
        >
          {this.status === 'error' ? this.errorLabel : this.copiedLabel}
        </span>
      </Host>
    );
  }
}
