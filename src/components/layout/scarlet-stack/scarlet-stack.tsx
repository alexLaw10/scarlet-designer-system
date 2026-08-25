import { Component, Prop, h, Host } from '@stencil/core';
import type { Alignment, Direction, JustifyContent, Size, Wrap } from '@/types';

/**
 * A flexbox layout primitive for stacking or rowing children with
 * consistent, token-based spacing.
 *
 * `direction` can change per breakpoint via `directionSm`/`directionMd`/
 * `directionLg`/`directionXl` — the classic "stacked on mobile, row on
 * desktop" pattern is `direction="column" direction-md="row"`. Each one
 * only takes effect from its breakpoint up and, left unset, falls back to
 * the next smaller breakpoint that *is* set (mobile-first cascade), down
 * to `direction` itself.
 *
 * @slot - The items to lay out.
 */
@Component({
  tag: 'scarlet-stack',
  styleUrl: 'scarlet-stack.scss',
  shadow: true
})
export class ScarletStack {
  /** Flex direction below the `sm` breakpoint (or at every size, if no responsive override is set). */
  @Prop() readonly direction: Direction = 'column';

  /** Flex direction from the `sm` breakpoint (640px) up. Falls back to `direction` when unset. */
  @Prop() readonly directionSm?: Direction;

  /** Flex direction from the `md` breakpoint (768px) up. Falls back to `directionSm`/`direction` when unset. */
  @Prop() readonly directionMd?: Direction;

  /** Flex direction from the `lg` breakpoint (1024px) up. Falls back to `directionMd`/`directionSm`/`direction` when unset. */
  @Prop() readonly directionLg?: Direction;

  /** Flex direction from the `xl` breakpoint (1280px) up. Falls back to `directionLg`/`directionMd`/`directionSm`/`direction` when unset. */
  @Prop() readonly directionXl?: Direction;

  /** Space between items, from the design system's spacing scale. */
  @Prop() readonly gap: Size = 'md';

  /** Cross-axis alignment (`align-items`). */
  @Prop() readonly align: Alignment = 'stretch';

  /** Main-axis distribution (`justify-content`). */
  @Prop() readonly justify: JustifyContent = 'start';

  /** Whether items wrap onto multiple lines. */
  @Prop() readonly wrap: Wrap = 'nowrap';

  render() {
    const style: { [key: string]: string } = {
      '--scarlet-stack-direction': this.direction
    };
    if (this.directionSm) style['--scarlet-stack-direction-sm'] = this.directionSm;
    if (this.directionMd) style['--scarlet-stack-direction-md'] = this.directionMd;
    if (this.directionLg) style['--scarlet-stack-direction-lg'] = this.directionLg;
    if (this.directionXl) style['--scarlet-stack-direction-xl'] = this.directionXl;

    return (
      <Host
        class={{
          'scarlet-stack-host': true,
          [`scarlet-stack-host--gap-${this.gap}`]: true,
          [`scarlet-stack-host--align-${this.align}`]: true,
          [`scarlet-stack-host--justify-${this.justify}`]: true,
          [`scarlet-stack-host--wrap-${this.wrap}`]: true
        }}
        style={style}
      >
        <slot />
      </Host>
    );
  }
}
