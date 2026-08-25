import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import type { Color } from '@/types';

export type ScarletChipVariant = 'solid' | 'outline' | 'soft';

/**
 * A small, dismissible tag — for an active filter, a selected option, an
 * added item in a multi-value input. Not a `<scarlet-badge>` with a close
 * button bolted on: unlike a badge, this is meant to be interactive.
 *
 * @slot - The chip's label.
 */
@Component({
  tag: 'scarlet-chip',
  styleUrl: 'scarlet-chip.scss',
  shadow: true
})
export class ScarletChip {
  /** Semantic color of the chip. */
  @Prop() readonly color: Color = 'neutral';

  /** Visual style of the chip. */
  @Prop() readonly variant: ScarletChipVariant = 'soft';

  /** Shows a remove ("x") button. */
  @Prop() readonly removable = false;

  /** Disables the remove button and dims the chip. */
  @Prop() readonly disabled = false;

  /** Emitted when the remove button is activated. The chip does not remove itself — the consumer owns the list it came from. */
  @Event() scarletRemove!: EventEmitter<void>;

  private handleRemove = (event: MouseEvent): void => {
    event.stopPropagation();
    if (this.disabled) return;
    this.scarletRemove.emit();
  };

  render() {
    return (
      <Host
        class={{
          'scarlet-chip-host': true,
          [`scarlet-chip-host--${this.variant}`]: true,
          [`scarlet-chip-host--${this.color}`]: true,
          'scarlet-chip-host--disabled': this.disabled
        }}
      >
        <span class='scarlet-chip__label'>
          <slot />
        </span>
        {this.removable ? (
          <button
            type='button'
            class='scarlet-chip__remove'
            disabled={this.disabled}
            aria-label='Remover'
            onClick={this.handleRemove}
          >
            <scarlet-icon name='x' size='0.85em' />
          </button>
        ) : null}
      </Host>
    );
  }
}
