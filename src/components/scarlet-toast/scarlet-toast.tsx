import { Component, Prop, Watch, Event, type EventEmitter, h, Host } from '@stencil/core';
import type { ScarletAlertStatus } from '../scarlet-alert/scarlet-alert';

export type ScarletToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

/**
 * A self-dismissing status message, fixed to a corner of the viewport.
 * For multiple simultaneous toasts, render several instances inside a
 * consumer-owned stacking container (this component does not manage a queue).
 *
 * @slot - Default slot for the toast message.
 * @slot title - Optional slot for a bold title above the message.
 */
@Component({
  tag: 'scarlet-toast',
  styleUrl: 'scarlet-toast.scss',
  shadow: true,
})
export class ScarletToast {
  private dismissTimeout?: ReturnType<typeof setTimeout>;

  /** Whether the toast is visible. */
  @Prop({ mutable: true }) open = true;

  /** Semantic status of the toast. */
  @Prop() readonly status: ScarletAlertStatus = 'info';

  /** Milliseconds before the toast auto-dismisses. `0` disables auto-dismiss. */
  @Prop() readonly duration = 4000;

  /** Shows a dismiss (close) button. */
  @Prop() readonly dismissible = true;

  /** Corner of the viewport the toast is anchored to. */
  @Prop() readonly position: ScarletToastPosition = 'bottom-right';

  /**
   * Emitted when the toast is dismissed (by timer, close button, or the
   * `open` prop being set to false). Cancelable: call `event.preventDefault()`
   * to keep it visible and handle removal yourself.
   */
  @Event({ cancelable: true }) scarletDismiss!: EventEmitter<void>;

  connectedCallback(): void {
    this.scheduleAutoDismiss();
  }

  disconnectedCallback(): void {
    clearTimeout(this.dismissTimeout);
  }

  @Watch('open')
  handleOpenChange(open: boolean): void {
    clearTimeout(this.dismissTimeout);
    if (open) {
      this.scheduleAutoDismiss();
    }
  }

  private scheduleAutoDismiss(): void {
    if (this.open && this.duration > 0) {
      this.dismissTimeout = setTimeout(() => this.dismiss(), this.duration);
    }
  }

  private dismiss = (): void => {
    const event = this.scarletDismiss.emit();
    if (!event.defaultPrevented) {
      this.open = false;
    }
  };

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <Host
        class={{
          'scarlet-toast-host': true,
          [`scarlet-toast-host--${this.status}`]: true,
          [`scarlet-toast-host--${this.position}`]: true,
        }}
        role="status"
        aria-live="polite"
      >
        <div class="scarlet-toast__content">
          <div class="scarlet-toast__title">
            <slot name="title" />
          </div>
          <div class="scarlet-toast__message">
            <slot />
          </div>
        </div>
        {this.dismissible ? (
          <button type="button" class="scarlet-toast__dismiss" part="dismiss" aria-label="Fechar" onClick={this.dismiss}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <line x1="6" y1="6" x2="18" y2="18" stroke-linecap="round" />
              <line x1="18" y1="6" x2="6" y2="18" stroke-linecap="round" />
            </svg>
          </button>
        ) : null}
      </Host>
    );
  }
}
