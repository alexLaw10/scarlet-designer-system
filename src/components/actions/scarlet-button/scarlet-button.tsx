import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import type { Color, Size, Variant } from '@/types';

/**
 * A clickable action element with solid, outline, ghost and link variants.
 * An icon (e.g. `<scarlet-icon>`) goes in the `start`/`end` slot alongside
 * the default slot's text — `<scarlet-button><scarlet-icon slot="start"
 * name="check" />Salvar</scarlet-button>`. For an icon with no visible text
 * at all, add `iconOnly` (which turns the button square instead of its
 * usual text-driven width) and `ariaLabel` (required then — nothing else
 * gives the button an accessible name).
 *
 * @slot - Default slot for the button label.
 * @slot start - Content placed before the label (e.g. an icon).
 * @slot end - Content placed after the label (e.g. an icon).
 */
@Component({
  tag: 'scarlet-button',
  styleUrl: 'scarlet-button.scss',
  shadow: true
})
export class ScarletButton {
  /** Visual style of the button. */
  @Prop() readonly variant: Variant = 'solid';

  /** Semantic color of the button. */
  @Prop() readonly color: Color = 'primary';

  /** Size of the button. */
  @Prop() readonly size: Size = 'md';

  /** Native `type` attribute passed to the underlying `<button>`. */
  @Prop() readonly type: 'button' | 'submit' | 'reset' = 'button';

  /** Disables the button, preventing interaction and the `scarletClick` event. */
  @Prop() readonly disabled = false;

  /** Shows a loading spinner and blocks interaction, without changing layout width. */
  @Prop() readonly loading = false;

  /** Stretches the button to fill the width of its container. */
  @Prop() readonly fullWidth = false;

  /** Makes the button square (width matches its height) instead of sized to its text — for a button whose only content is an icon. Set `ariaLabel` alongside it. */
  @Prop() readonly iconOnly = false;

  /** Accessible label. Required when the button has no visible text (icon-only buttons). */
  @Prop() readonly ariaLabel?: string;

  /** Emitted when the button is activated by click or keyboard, and is not disabled/loading. */
  @Event() scarletClick!: EventEmitter<MouseEvent>;

  private handleClick = (event: MouseEvent): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.scarletClick.emit(event);
  };

  render() {
    const isDisabled = this.disabled || this.loading;

    return (
      <Host
        class={{
          'scarlet-button-host': true,
          'scarlet-button-host--full-width': this.fullWidth
        }}
      >
        <button
          class={{
            'scarlet-button': true,
            [`scarlet-button--${this.variant}`]: true,
            [`scarlet-button--${this.color}`]: true,
            [`scarlet-button--${this.size}`]: true,
            'scarlet-button--loading': this.loading,
            'scarlet-button--icon-only': this.iconOnly
          }}
          type={this.type}
          disabled={isDisabled}
          aria-busy={this.loading ? 'true' : undefined}
          aria-label={this.ariaLabel}
          onClick={this.handleClick}
        >
          {this.loading ? (
            <span class='scarlet-button__spinner' part='spinner' aria-hidden='true' />
          ) : null}
          <span class='scarlet-button__content'>
            <slot name='start' />
            <slot />
            <slot name='end' />
          </span>
        </button>
      </Host>
    );
  }
}
