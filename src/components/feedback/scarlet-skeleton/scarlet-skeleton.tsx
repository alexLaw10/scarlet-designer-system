import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletSkeletonVariant = 'text' | 'circle' | 'rect';

/**
 * A loading placeholder shape — swap it in for content that hasn't arrived
 * yet (a card, an avatar, a paragraph). Purely decorative (`aria-hidden`):
 * announcing the *loading* state itself (e.g. `aria-busy` on the section
 * being replaced) is the consumer's responsibility, not this component's.
 */
@Component({
  tag: 'scarlet-skeleton',
  styleUrl: 'scarlet-skeleton.scss',
  shadow: true
})
export class ScarletSkeleton {
  /** Shape of the placeholder. */
  @Prop() readonly variant: ScarletSkeletonVariant = 'text';

  /** Any valid CSS width. Defaults to 100% for `text`/`rect`, or `height`'s value for `circle`. */
  @Prop() readonly width?: string;

  /** Any valid CSS height. Defaults to one text line's height for `text`, or `width`'s value for `circle`. */
  @Prop() readonly height?: string;

  /** Number of stacked lines, only for `variant="text"`. The last line renders narrower, like a paragraph's ragged edge. */
  @Prop() readonly lines = 1;

  render() {
    const style =
      this.width || this.height ? { width: this.width, height: this.height } : undefined;
    const count = this.variant === 'text' ? Math.max(1, this.lines) : 1;

    return (
      <Host class='scarlet-skeleton-host' aria-hidden='true'>
        {Array.from({ length: count }).map(() => (
          <span
            class={{ 'scarlet-skeleton': true, [`scarlet-skeleton--${this.variant}`]: true }}
            style={style}
          />
        ))}
      </Host>
    );
  }
}
