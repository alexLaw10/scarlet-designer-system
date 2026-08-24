import { Component, Prop, h, Host } from '@stencil/core';
import type { Alignment, Size } from '../../types';

const gapTokens: Record<Size, string> = {
  xs: 'var(--scarlet-space-1)',
  sm: 'var(--scarlet-space-2)',
  md: 'var(--scarlet-space-4)',
  lg: 'var(--scarlet-space-6)',
  xl: 'var(--scarlet-space-8)',
};

/**
 * A CSS grid layout primitive with equal-width columns and token-based
 * gaps. Pair with `<scarlet-grid-item>` to span multiple columns/rows.
 *
 * @slot - The items to lay out.
 */
@Component({
  tag: 'scarlet-grid',
  styleUrl: 'scarlet-grid.scss',
  shadow: true,
})
export class ScarletGrid {
  /** Number of equal-width columns. */
  @Prop() readonly columns = 12;

  /** Gap between rows and columns, from the design system's spacing scale. Overridden individually by `rowGap`/`columnGap`. */
  @Prop() readonly gap: Size = 'md';

  /** Overrides the row gap. */
  @Prop() readonly rowGap?: Size;

  /** Overrides the column gap. */
  @Prop() readonly columnGap?: Size;

  /** Cross-axis alignment (`align-items`) for items within their cell. */
  @Prop() readonly align: Alignment = 'stretch';

  render() {
    return (
      <Host
        class={{
          'scarlet-grid-host': true,
          [`scarlet-grid-host--align-${this.align}`]: true,
        }}
        style={{
          gridTemplateColumns: `repeat(${this.columns}, minmax(0, 1fr))`,
          rowGap: gapTokens[this.rowGap ?? this.gap],
          columnGap: gapTokens[this.columnGap ?? this.gap],
        }}
      >
        <slot />
      </Host>
    );
  }
}
