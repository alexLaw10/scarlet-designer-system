import { Component, Prop, Watch, Event, type EventEmitter, h, Host, Method } from '@stencil/core';

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
  shadow: true,
})
export class ScarletModal {
  private dialogEl?: HTMLDialogElement;

  /** Whether the modal is open. */
  @Prop({ mutable: true }) open = false;

  /** Size of the modal. */
  @Prop() readonly size: ScarletModalSize = 'md';

  /** Accessible label for the dialog, used when there is no visible header slot. */
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
    }
  }

  private openDialog(): void {
    if (this.dialogEl && !this.dialogEl.open) {
      this.dialogEl.showModal();
      this.scarletShow.emit();
    }
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
      <Host class="scarlet-modal-host">
        <dialog
          ref={(el) => (this.dialogEl = el)}
          class={{ 'scarlet-modal': true, [`scarlet-modal--${this.size}`]: true }}
          aria-label={this.ariaLabel}
          onCancel={this.handleCancel}
          onClick={this.handleDialogClick}
        >
          <div class="scarlet-modal__box">
            <div class="scarlet-modal__header">
              <slot name="header" />
              <button type="button" class="scarlet-modal__close" part="close" aria-label="Fechar" onClick={this.requestClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round" />
                  <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <div class="scarlet-modal__body">
              <slot />
            </div>
            <div class="scarlet-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}
