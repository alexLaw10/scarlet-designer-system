import { Component, Prop, h, Host } from '@stencil/core';
import type { JustifyContent } from '@/types';

/**
 * A horizontal bar for grouping related actions (buttons, a search field,
 * an icon menu) — `role="toolbar"` with token-based gap, distinct from
 * `scarlet-stack` in intent (actions, not arbitrary layout) even though
 * the underlying flex mechanics are similar.
 *
 * @slot - The toolbar's items, in order.
 */
@Component({
  tag: 'scarlet-toolbar',
  styleUrl: 'scarlet-toolbar.scss',
  shadow: true
})
export class ScarletToolbar {
  /** Accessible label for the `toolbar` role — required whenever there's more than one toolbar on the page. */
  @Prop() readonly ariaLabel?: string;

  /** Main-axis distribution of items. */
  @Prop() readonly justify: JustifyContent = 'start';

  render() {
    return (
      <Host
        class={{
          'scarlet-toolbar-host': true,
          [`scarlet-toolbar-host--justify-${this.justify}`]: true
        }}
        role='toolbar'
        aria-label={this.ariaLabel}
      >
        <slot />
      </Host>
    );
  }
}
