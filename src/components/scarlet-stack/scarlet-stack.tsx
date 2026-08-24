import { Component, Prop, h, Host } from '@stencil/core';
import type { Alignment, Direction, JustifyContent, Size, Wrap } from '../../types';

/**
 * A flexbox layout primitive for stacking or rowing children with
 * consistent, token-based spacing.
 *
 * @slot - The items to lay out.
 */
@Component({
  tag: 'scarlet-stack',
  styleUrl: 'scarlet-stack.scss',
  shadow: true,
})
export class ScarletStack {
  /** Flex direction. */
  @Prop() readonly direction: Direction = 'column';

  /** Space between items, from the design system's spacing scale. */
  @Prop() readonly gap: Size = 'md';

  /** Cross-axis alignment (`align-items`). */
  @Prop() readonly align: Alignment = 'stretch';

  /** Main-axis distribution (`justify-content`). */
  @Prop() readonly justify: JustifyContent = 'start';

  /** Whether items wrap onto multiple lines. */
  @Prop() readonly wrap: Wrap = 'nowrap';

  render() {
    return (
      <Host
        class={{
          'scarlet-stack-host': true,
          [`scarlet-stack-host--${this.direction}`]: true,
          [`scarlet-stack-host--gap-${this.gap}`]: true,
          [`scarlet-stack-host--align-${this.align}`]: true,
          [`scarlet-stack-host--justify-${this.justify}`]: true,
          [`scarlet-stack-host--wrap-${this.wrap}`]: true,
        }}
      >
        <slot />
      </Host>
    );
  }
}
