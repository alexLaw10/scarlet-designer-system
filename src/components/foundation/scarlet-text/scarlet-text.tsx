import { Component, Prop, h, Host } from '@stencil/core';
import type { TextAlign, TextColor } from '@/types';

export type ScarletTextAs = 'p' | 'span' | 'div' | 'label';
export type ScarletTextVariant = 'body-lg' | 'body-md' | 'body-sm' | 'caption';
export type ScarletTextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Body copy with the design system's text scale, color tokens and
 * single-line truncation — the general-purpose counterpart to `scarlet-heading`.
 */
@Component({
  tag: 'scarlet-text',
  styleUrl: 'scarlet-text.scss',
  shadow: true,
})
export class ScarletText {
  /** HTML tag rendered for the text. */
  @Prop() readonly as: ScarletTextAs = 'p';

  /** Visual size, from the design system's body/caption text scale. */
  @Prop() readonly variant: ScarletTextVariant = 'body-md';

  /** Text color token. */
  @Prop() readonly color: TextColor = 'primary';

  /** Text alignment. */
  @Prop() readonly align: TextAlign = 'left';

  /** Overrides the variant's default font weight. */
  @Prop() readonly weight?: ScarletTextWeight;

  /** Truncates overflowing text to a single line with an ellipsis. */
  @Prop() readonly truncate = false;

  render() {
    const Tag = this.as;

    return (
      <Host class={{ 'scarlet-text-host': true, 'scarlet-text-host--inline': this.as === 'span' }}>
        <Tag
          class={{
            'scarlet-text': true,
            [`scarlet-text--${this.variant}`]: true,
            [`scarlet-text--color-${this.color}`]: true,
            [`scarlet-text--align-${this.align}`]: true,
            [`scarlet-text--weight-${this.weight}`]: Boolean(this.weight),
            'scarlet-text--truncate': this.truncate,
          }}
        >
          <slot />
        </Tag>
      </Host>
    );
  }
}
