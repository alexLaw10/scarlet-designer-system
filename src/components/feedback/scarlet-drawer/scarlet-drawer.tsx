import { Component, Prop, Watch, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import { generateId } from '@/utils';

export type ScarletDrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type ScarletDrawerSize = 'sm' | 'md' | 'lg';

/**
 * A panel that slides in from an edge of the screen — the mobile-friendlier
 * sibling of `scarlet-modal` for a filter panel, a form, a details view.
 * Built the same way `scarlet-modal` is, on the native `<dialog>` element,
 * for the same free focus trapping/top-layer stacking/Escape handling — see
 * that component's own comments for the mechanics shared here (focus
 * restore, the cancelable `scarletClose`, `show()`/`hide()`).
 *
 * `size` sets the dimension along the axis the drawer slides on: width for
 * `left`/`right`, height for `top`/`bottom`.
 *
 * @slot header - Content rendered in the drawer header, e.g. a title.
 * @slot - Default slot for the drawer body.
 * @slot footer - Content rendered in the drawer footer, e.g. action buttons.
 */
@Component({
  tag: 'scarlet-drawer',
  styleUrl: 'scarlet-drawer.scss',
  shadow: true,
})
export class ScarletDrawer {
  private dialogEl?: HTMLDialogElement;
  private readonly headerId = generateId('scarlet-drawer-header');
  /** Element focused right before the drawer opened, restored to on close per WCAG 2.4.3. */
  private lastFocusedEl?: HTMLElement;

  /** Whether the drawer is open. */
  @Prop({ mutable: true }) open = false;

  /** Which edge of the screen the drawer slides in from. */
  @Prop() readonly placement: ScarletDrawerPlacement = 'right';

  /** Size along the slide axis: width for `left`/`right`, height for `top`/`bottom`. */
  @Prop() readonly size: ScarletDrawerSize = 'md';

  /**
   * Accessible label for the dialog. When omitted, the `header` slot's
   * content is used instead (via `aria-labelledby`) — set this explicitly
   * only when the drawer has no visible header, or the header text alone
   * isn't a good accessible name.
   */
  @Prop() readonly ariaLabel?: string;

  /** Closes the drawer when the backdrop (area outside the panel) is clicked. */
  @Prop() readonly dismissOnBackdropClick = true;

  /** Closes the drawer when Escape is pressed. */
  @Prop() readonly dismissOnEsc = true;

  /** Emitted after the drawer opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /**
   * Emitted when the drawer is about to close (Escape, backdrop click, the
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
    let active = document.activeElement as HTMLElement | null;
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

  /** Opens the drawer. */
  @Method()
  async show(): Promise<void> {
    this.open = true;
  }

  /** Requests the drawer to close (fires the cancelable `scarletClose` event first). */
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
      <Host class="scarlet-drawer-host">
        <dialog
          ref={(el) => (this.dialogEl = el)}
          class={{
            'scarlet-drawer': true,
            [`scarlet-drawer--${this.placement}`]: true,
            [`scarlet-drawer--${this.size}`]: true,
          }}
          aria-label={this.ariaLabel}
          aria-labelledby={this.ariaLabel ? undefined : this.headerId}
          onCancel={this.handleCancel}
          onClick={this.handleDialogClick}
        >
          <div class="scarlet-drawer__box">
            <div class="scarlet-drawer__header">
              <span id={this.headerId}>
                <slot name="header" />
              </span>
              <button type="button" class="scarlet-drawer__close" part="close" aria-label="Fechar" onClick={this.requestClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round" />
                  <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round" />
                </svg>
              </button>
            </div>
            <div class="scarlet-drawer__body">
              <slot />
            </div>
            <div class="scarlet-drawer__footer">
              <slot name="footer" />
            </div>
          </div>
        </dialog>
      </Host>
    );
  }
}
