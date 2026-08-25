import {
  Component,
  Prop,
  Watch,
  Event,
  type EventEmitter,
  h,
  Host,
  Method,
  Element
} from '@stencil/core';
import { generateId } from '@/utils';

export type ScarletModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * A modal dialog built on the native `<dialog>` element, which provides
 * focus trapping, top-layer stacking and Escape handling for free.
 *
 * @slot header - Content rendered in the dialog header, e.g. a title.
 * @slot - Default slot for the dialog body.
 * @slot footer - Content rendered in the dialog footer, e.g. action buttons.
 */
@Component({
  tag: 'scarlet-modal',
  styleUrl: 'scarlet-modal.scss',
  shadow: true
})
export class ScarletModal {
  @Element() el!: HTMLElement;

  private dialogEl?: HTMLDialogElement;
  private readonly headerId = generateId('scarlet-modal-header');
  /** Element focused right before the modal opened, restored to on close per WCAG 2.4.3. */
  private lastFocusedEl?: HTMLElement;

  /** Whether the modal is open. */
  @Prop({ mutable: true }) open = false;

  /** Size of the modal. */
  @Prop() readonly size: ScarletModalSize = 'md';

  /**
   * Accessible label for the dialog. When omitted, the `header` slot's
   * content is used instead (via `aria-labelledby`) — set this explicitly
   * only when the modal has no visible header, or the header text alone
   * isn't a good accessible name.
   */
  @Prop() readonly ariaLabel?: string;

  /** Closes the modal when the backdrop (area outside the dialog box) is clicked. */
  @Prop() readonly dismissOnBackdropClick = true;

  /** Closes the modal when Escape is pressed. */
  @Prop() readonly dismissOnEsc = true;

  /** Emitted after the modal opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /**
   * Emitted when the modal is about to close (Escape, backdrop click, the
   * close button, or the `open` prop being set to false). Cancelable: call
   * `event.preventDefault()` to keep it open.
   */
  @Event({ cancelable: true }) scarletClose!: EventEmitter<void>;

  componentDidLoad(): void {
    if (this.open) {
      this.openDialog();
    }
  }

  @Watch('open')
  handleOpenChange(open: boolean): void {
    if (open) {
      this.openDialog();
    } else if (this.dialogEl?.open) {
      this.dialogEl.close();
      this.restoreFocus();
    }
  }

  private openDialog(): void {
    if (this.dialogEl && !this.dialogEl.open) {
      // Native <dialog> moves focus inside itself on showModal(), but never
      // restores it on close — that's on us (WCAG 2.4.3 Focus Order).
      this.lastFocusedEl = this.getDeepActiveElement();
      this.dialogEl.showModal();
      this.scarletShow.emit();
    }
  }

  // document.activeElement stops at the host of the outermost open shadow
  // tree (e.g. a <scarlet-button> trigger, not the native <button> inside
  // it) — that host usually isn't itself focusable, so .focus() on it would
  // silently no-op. Walk into .shadowRoot.activeElement to find the real
  // focused element before capturing it.
  private getDeepActiveElement(): HTMLElement | undefined {
    let active = this.el.ownerDocument?.activeElement as HTMLElement | null;
    while (active?.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement as HTMLElement;
    }
    return active ?? undefined;
  }

  private restoreFocus(): void {
    if (this.lastFocusedEl?.isConnected) {
      this.lastFocusedEl.focus();
    }
    this.lastFocusedEl = undefined;
  }

  /** Opens the modal. */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  /** Requests the modal to close (fires the cancelable `scarletClose` event first). */
  @Method()
  async hide(): Promise<void> {
    this.requestClose();
  }

  private requestClose = (): void => {
    const event = this.scarletClose.emit();
    if (event.defaultPrevented) {
      return;
    }
    this.open = false;
  };

  private handleCancel = (event: Event): void => {
    // Fired by the browser on Escape, before it would close the dialog itself.
    event.preventDefault();
    if (this.dismissOnEsc) {
      this.requestClose();
    }
  };

  private handleDialogClick = (event: MouseEvent): void => {
    if (event.target === this.dialogEl && this.dismissOnBackdropClick) {
      this.requestClose();
    }
  };

  render() {
    return (
      <Host class='scarlet-modal-host'>
        <dialog
          ref={el => (this.dialogEl = el)}
          class={{ 'scarlet-modal': true, [`scarlet-modal--${this.size}`]: true }}
          aria-label={this.ariaLabel}
          aria-labelledby={this.ariaLabel ? undefined : this.headerId}
          onCancel={this.handleCancel}
          onClick={this.handleDialogClick}
        >
          <div class='scarlet-modal__box'>
            <div class='scarlet-modal__header'>
              <span id={this.headerId}>
                <slot name='header' />
              </span>
              <button
                type='button'
                class='scarlet-modal__close'
                part='close'
                aria-label='Fechar'
                onClick={this.requestClose}
              >
                <svg
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  stroke-width='2'
                  aria-hidden='true'
                >
                  <line x1='6' y1='6' x2='18' y2='18' stroke-linecap='round' />
                  <line x1='18' y1='6' x2='6' y2='18' stroke-linecap='round' />
                </svg>
              </button>
            </div>
            <div class='scarlet-modal__body'>
              <slot />
            </div>
            <div class='scarlet-modal__footer'>
              <slot name='footer' />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}
