import { Component, Prop, State, Event, type EventEmitter, h, Host } from '@stencil/core';

export type ScarletAlertStatus = 'success' | 'warning' | 'error' | 'info';
export type ScarletAlertVariant = 'solid' | 'outline' | 'soft';

/**
 * An inline status message with optional title, icon and dismiss action.
 *
 * @slot - Default slot for the alert message.
 * @slot title - Optional slot for a bold title above the message.
 */
@Component({
  tag: 'scarlet-alert',
  styleUrl: 'scarlet-alert.scss',
  shadow: true
})
export class ScarletAlert {
  @State() private visible = true;

  /** Semantic status of the alert. */
  @Prop() readonly status: ScarletAlertStatus = 'info';

  /** Visual style of the alert. */
  @Prop() readonly variant: ScarletAlertVariant = 'soft';

  /** Shows a status icon before the content. */
  @Prop() readonly icon = true;

  /** Shows a dismiss (close) button. */
  @Prop() readonly dismissible = false;

  /**
   * Emitted when the dismiss button is activated. The event is cancelable:
   * call `event.preventDefault()` to keep the alert visible and handle
   * removal yourself (e.g. to run a custom exit animation).
   */
  @Event({ cancelable: true }) scarletDismiss!: EventEmitter<void>;

  private handleDismiss = (): void => {
    const event = this.scarletDismiss.emit();
    if (!event.defaultPrevented) {
      this.visible = false;
    }
  };

  private renderIcon() {
    switch (this.status) {
      case 'success':
        return (
          <svg class='scarlet-alert__icon' part='icon' viewBox='0 0 24 24' aria-hidden='true'>
            <circle cx='12' cy='12' r='9' fill='none' stroke='currentColor' stroke-width='1.5' />
            <polyline
              points='8,12.5 11,15.5 16,9'
              fill='none'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        );
      case 'warning':
        return (
          <svg class='scarlet-alert__icon' part='icon' viewBox='0 0 24 24' aria-hidden='true'>
            <polygon
              points='12,3.5 21,19.5 3,19.5'
              fill='none'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linejoin='round'
            />
            <line
              x1='12'
              y1='10'
              x2='12'
              y2='14.5'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
            />
            <circle cx='12' cy='17' r='0.75' fill='currentColor' stroke='none' />
          </svg>
        );
      case 'error':
        return (
          <svg class='scarlet-alert__icon' part='icon' viewBox='0 0 24 24' aria-hidden='true'>
            <circle cx='12' cy='12' r='9' fill='none' stroke='currentColor' stroke-width='1.5' />
            <line
              x1='9'
              y1='9'
              x2='15'
              y2='15'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
            />
            <line
              x1='15'
              y1='9'
              x2='9'
              y2='15'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
            />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg class='scarlet-alert__icon' part='icon' viewBox='0 0 24 24' aria-hidden='true'>
            <circle cx='12' cy='12' r='9' fill='none' stroke='currentColor' stroke-width='1.5' />
            <line
              x1='12'
              y1='11'
              x2='12'
              y2='16'
              stroke='currentColor'
              stroke-width='1.5'
              stroke-linecap='round'
            />
            <circle cx='12' cy='8' r='0.75' fill='currentColor' stroke='none' />
          </svg>
        );
    }
  }

  render() {
    if (!this.visible) {
      return null;
    }

    return (
      <Host
        class={{
          'scarlet-alert-host': true,
          [`scarlet-alert-host--${this.variant}`]: true,
          [`scarlet-alert-host--${this.status}`]: true
        }}
        role='alert'
      >
        {this.icon ? this.renderIcon() : null}
        <div class='scarlet-alert__content'>
          <div class='scarlet-alert__title'>
            <slot name='title' />
          </div>
          <div class='scarlet-alert__message'>
            <slot />
          </div>
        </div>
        {this.dismissible ? (
          <button
            type='button'
            class='scarlet-alert__dismiss'
            part='dismiss'
            aria-label='Fechar'
            onClick={this.handleDismiss}
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
        ) : null}
      </Host>
    );
  }
}
