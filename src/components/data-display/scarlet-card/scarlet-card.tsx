import { Component, Prop, Event, type EventEmitter, h, Host, Listen } from '@stencil/core';
import type { Size } from '@/types';

export type ScarletCardVariant = 'elevated' | 'outlined' | 'flat';

/**
 * A container for grouping related content, with optional header/footer slots.
 *
 * @slot header - Content rendered above the body, e.g. a title.
 * @slot - Default slot for the card body.
 * @slot footer - Content rendered below the body, e.g. actions.
 */
@Component({
  tag: 'scarlet-card',
  styleUrl: 'scarlet-card.scss',
  shadow: true,
})
export class ScarletCard {
  /** Visual style of the card. */
  @Prop() readonly variant: ScarletCardVariant = 'elevated';

  /** Internal padding of the card body. */
  @Prop() readonly padding: Size = 'md';

  /** Makes the whole card behave as a single clickable/keyboard-activatable control. */
  @Prop() readonly interactive = false;

  /** Emitted when an interactive card is activated by click, Enter or Space. */
  @Event() scarletClick!: EventEmitter<MouseEvent | KeyboardEvent>;

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scarletClick.emit(event);
    }
  }

  private handleClick = (event: MouseEvent): void => {
    if (!this.interactive) return;
    this.scarletClick.emit(event);
  };

  render() {
    return (
      <Host
        class={{
          'scarlet-card-host': true,
          [`scarlet-card-host--${this.variant}`]: true,
          'scarlet-card-host--interactive': this.interactive,
        }}
        role={this.interactive ? 'button' : undefined}
        tabindex={this.interactive ? 0 : undefined}
        onClick={this.handleClick}
      >
        <div class="scarlet-card__header">
          <slot name="header" />
        </div>
        <div
          class={{
            'scarlet-card__body': true,
            [`scarlet-card__body--${this.padding}`]: true,
          }}
        >
          <slot />
        </div>
        <div class="scarlet-card__footer">
          <slot name="footer" />
        </div>
      </Host>
    );
  }
}
