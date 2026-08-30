import { Component, Prop, h, Host } from '@stencil/core';

/**
 * A cell inside a `<scarlet-grid>` that can span multiple columns/rows.
 *
 * `colSpan`/`rowSpan` can change per breakpoint via `colSpanSm`/`colSpanMd`/
 * `colSpanLg`/`colSpanXl` (and the `rowSpan` equivalents) — the classic "full
 * row on mobile, a couple columns on desktop" pattern is
 * `col-span="{columns}" col-span-md="2"`. Each one only takes effect from
 * its breakpoint up and, left unset, falls back to the next smaller
 * breakpoint that *is* set (mobile-first cascade, same as `<scarlet-grid>`'s
 * own `columns`/`columnsSm`/etc.), down to `colSpan`/`rowSpan` themselves.
 *
 * @slot - The cell's content.
 */
@Component({
  tag: 'scarlet-grid-item',
  styleUrl: 'scarlet-grid-item.scss',
  shadow: true
})
export class ScarletGridItem {
  /** Number of columns this item spans below the `sm` breakpoint (or at every size, if no responsive override is set). */
  @Prop() readonly colSpan = 1;

  /** Column span from the `sm` breakpoint (640px) up. Falls back to `colSpan` when unset. */
  @Prop() readonly colSpanSm?: number;

  /** Column span from the `md` breakpoint (768px) up. Falls back to `colSpanSm`/`colSpan` when unset. */
  @Prop() readonly colSpanMd?: number;

  /** Column span from the `lg` breakpoint (1024px) up. Falls back to `colSpanMd`/`colSpanSm`/`colSpan` when unset. */
  @Prop() readonly colSpanLg?: number;

  /** Column span from the `xl` breakpoint (1280px) up. Falls back to `colSpanLg`/`colSpanMd`/`colSpanSm`/`colSpan` when unset. */
  @Prop() readonly colSpanXl?: number;

  /** Number of rows this item spans below the `sm` breakpoint (or at every size, if no responsive override is set). */
  @Prop() readonly rowSpan = 1;

  /** Row span from the `sm` breakpoint (640px) up. Falls back to `rowSpan` when unset. */
  @Prop() readonly rowSpanSm?: number;

  /** Row span from the `md` breakpoint (768px) up. Falls back to `rowSpanSm`/`rowSpan` when unset. */
  @Prop() readonly rowSpanMd?: number;

  /** Row span from the `lg` breakpoint (1024px) up. Falls back to `rowSpanMd`/`rowSpanSm`/`rowSpan` when unset. */
  @Prop() readonly rowSpanLg?: number;

  /** Row span from the `xl` breakpoint (1280px) up. Falls back to `rowSpanLg`/`rowSpanMd`/`rowSpanSm`/`rowSpan` when unset. */
  @Prop() readonly rowSpanXl?: number;

  render() {
    const style: { [key: string]: string } = {
      '--scarlet-grid-item-col-span': String(this.colSpan),
      '--scarlet-grid-item-row-span': String(this.rowSpan)
    };
    if (this.colSpanSm !== undefined)
      style['--scarlet-grid-item-col-span-sm'] = String(this.colSpanSm);
    if (this.colSpanMd !== undefined)
      style['--scarlet-grid-item-col-span-md'] = String(this.colSpanMd);
    if (this.colSpanLg !== undefined)
      style['--scarlet-grid-item-col-span-lg'] = String(this.colSpanLg);
    if (this.colSpanXl !== undefined)
      style['--scarlet-grid-item-col-span-xl'] = String(this.colSpanXl);
    if (this.rowSpanSm !== undefined)
      style['--scarlet-grid-item-row-span-sm'] = String(this.rowSpanSm);
    if (this.rowSpanMd !== undefined)
      style['--scarlet-grid-item-row-span-md'] = String(this.rowSpanMd);
    if (this.rowSpanLg !== undefined)
      style['--scarlet-grid-item-row-span-lg'] = String(this.rowSpanLg);
    if (this.rowSpanXl !== undefined)
      style['--scarlet-grid-item-row-span-xl'] = String(this.rowSpanXl);

    return (
      <Host class='scarlet-grid-item-host' style={style}>
        <slot />
      </Host>
    );
  }
}
