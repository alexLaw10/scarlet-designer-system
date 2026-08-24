import { Component, Prop, h, Host } from '@stencil/core';
import type { Color } from '../../types';

export type ScarletBadgeVariant = 'solid' | 'outline' | 'soft';
export type ScarletBadgeSize = 'xs' | 'sm' | 'md';

/**
 * A small status/count label, or a bare notification dot.
 *
 * @slot - Default slot for the badge text. Ignored when `dot` is set.
 */
@Component({
  tag: 'scarlet-badge',
  styleUrl: 'scarlet-badge.scss',
  shadow: true,
})
export class ScarletBadge {
  /** Semantic color of the badge. */
  @Prop() readonly color: Color = 'primary';

  /** Visual style of the badge. */
  @Prop() readonly variant: ScarletBadgeVariant = 'solid';

  /** Size of the badge. */
  @Prop() readonly size: ScarletBadgeSize = 'sm';

  /** Renders as a small notification dot instead of a text pill. */
  @Prop() readonly dot = false;

  render() {
    return (
      <Host
        class={{
          'scarlet-badge-host': true,
          [`scarlet-badge-host--${this.variant}`]: true,
          [`scarlet-badge-host--${this.color}`]: true,
          [`scarlet-badge-host--${this.size}`]: true,
          'scarlet-badge-host--dot': this.dot,
        }}
      >
        {this.dot ? null : <slot />}
      </Host>
    );
  }
}
