import { Component, Prop, h, Host } from '@stencil/core';

/**
 * A cell inside a `<scarlet-grid>` that can span multiple columns/rows.
 *
 * @slot - The cell's content.
 */
@Component({
  tag: 'scarlet-grid-item',
  styleUrl: 'scarlet-grid-item.scss',
  shadow: true
})
export class ScarletGridItem {
  /** Number of columns this item spans. */
  @Prop() readonly colSpan = 1;

  /** Number of rows this item spans. */
  @Prop() readonly rowSpan = 1;

  render() {
    return (
      <Host
        class='scarlet-grid-item-host'
        style={{
          gridColumn: `span ${this.colSpan} / span ${this.colSpan}`,
          gridRow: `span ${this.rowSpan} / span ${this.rowSpan}`
        }}
      >
        <slot />
      </Host>
    );
  }
}
