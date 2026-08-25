import { Component, Prop, h, Host } from '@stencil/core';
import type { Alignment, Size } from '@/types';

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
 * `columns` can change per breakpoint via `columnsSm`/`columnsMd`/
 * `columnsLg`/`columnsXl` — each one only takes effect from its breakpoint
 * up and, left unset, falls back to the next smaller breakpoint that *is*
 * set (mobile-first cascade), down to `columns` itself. E.g. `columns={1}
 * columns-md={3}` renders 1 column below 768px and 3 from 768px up, with
 * no separate `sm`/`lg`/`xl` value needed.
 *
 * @slot - The items to lay out.
 */
@Component({
  tag: 'scarlet-grid',
  styleUrl: 'scarlet-grid.scss',
  shadow: true,
})
export class ScarletGrid {
  /** Number of equal-width columns below the `sm` breakpoint (or at every size, if no responsive override is set). */
  @Prop() readonly columns = 12;

  /** Column count from the `sm` breakpoint (640px) up. Falls back to `columns` when unset. */
  @Prop() readonly columnsSm?: number;

  /** Column count from the `md` breakpoint (768px) up. Falls back to `columnsSm`/`columns` when unset. */
  @Prop() readonly columnsMd?: number;

  /** Column count from the `lg` breakpoint (1024px) up. Falls back to `columnsMd`/`columnsSm`/`columns` when unset. */
  @Prop() readonly columnsLg?: number;

  /** Column count from the `xl` breakpoint (1280px) up. Falls back to `columnsLg`/`columnsMd`/`columnsSm`/`columns` when unset. */
  @Prop() readonly columnsXl?: number;

  /** Gap between rows and columns, from the design system's spacing scale. Overridden individually by `rowGap`/`columnGap`. */
  @Prop() readonly gap: Size = 'md';

  /** Overrides the row gap. */
  @Prop() readonly rowGap?: Size;

  /** Overrides the column gap. */
  @Prop() readonly columnGap?: Size;

  /** Cross-axis alignment (`align-items`) for items within their cell. */
  @Prop() readonly align: Alignment = 'stretch';

  render() {
    const style: { [key: string]: string } = {
      '--scarlet-grid-columns': String(this.columns),
      rowGap: gapTokens[this.rowGap ?? this.gap],
      columnGap: gapTokens[this.columnGap ?? this.gap],
    };
    if (this.columnsSm !== undefined) style['--scarlet-grid-columns-sm'] = String(this.columnsSm);
    if (this.columnsMd !== undefined) style['--scarlet-grid-columns-md'] = String(this.columnsMd);
    if (this.columnsLg !== undefined) style['--scarlet-grid-columns-lg'] = String(this.columnsLg);
    if (this.columnsXl !== undefined) style['--scarlet-grid-columns-xl'] = String(this.columnsXl);

    return (
      <Host
        class={{
          'scarlet-grid-host': true,
          [`scarlet-grid-host--align-${this.align}`]: true,
        }}
        style={style}
      >
        <slot />
      </Host>
    );
  }
}
