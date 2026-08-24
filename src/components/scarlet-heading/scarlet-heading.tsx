import { Component, Prop, h, Host } from '@stencil/core';
import type { TextAlign, TextColor } from '../../types';

export type ScarletHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type ScarletHeadingVariant =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm';

const defaultVariantByLevel: Record<ScarletHeadingLevel, ScarletHeadingVariant> = {
  1: 'display-md',
  2: 'heading-xl',
  3: 'heading-lg',
  4: 'heading-md',
  5: 'heading-sm',
  6: 'heading-sm',
};

/**
 * A semantic heading (`<h1>`–`<h6>`) with an independently controllable
 * visual size — document structure (`level`) and visual hierarchy
 * (`variant`) don't have to match one-to-one.
 */
@Component({
  tag: 'scarlet-heading',
  styleUrl: 'scarlet-heading.scss',
  shadow: true,
})
export class ScarletHeading {
  /** Semantic heading level — which HTML tag (`h1`–`h6`) is rendered. */
  @Prop() readonly level: ScarletHeadingLevel = 2;

  /** Visual size. Defaults to a sensible size for `level` when omitted. */
  @Prop() readonly variant?: ScarletHeadingVariant;

  /** Text color token. */
  @Prop() readonly color: TextColor = 'primary';

  /** Text alignment. */
  @Prop() readonly align: TextAlign = 'left';

  render() {
    const Tag = `h${this.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    const variant = this.variant ?? defaultVariantByLevel[this.level];

    return (
      <Host class="scarlet-heading-host">
        <Tag
          class={{
            'scarlet-heading': true,
            [`scarlet-heading--${variant}`]: true,
            [`scarlet-heading--color-${this.color}`]: true,
            [`scarlet-heading--align-${this.align}`]: true,
          }}
        >
          <slot />
        </Tag>
      </Host>
    );
  }
}
