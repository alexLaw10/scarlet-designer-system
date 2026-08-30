import { Component, Prop, h, Host } from '@stencil/core';
import type { Color } from '@/types';

export type ScarletLinkUnderline = 'always' | 'hover' | 'none';

/**
 * A styled inline text link — for a link inside a sentence/paragraph.
 * `scarlet-button variant="link"` is the button-semantics equivalent (an
 * action styled like a link); this is the reverse, a real `<a>` styled like
 * one. `target="_blank"` automatically gets `rel="noopener noreferrer"`
 * (unless `rel` is set explicitly) and a small external-link icon.
 *
 * @slot - The link's text.
 */
@Component({
  tag: 'scarlet-link',
  styleUrl: 'scarlet-link.scss',
  shadow: true
})
export class ScarletLink {
  /** Native `href`. Omitting it (and setting `disabled`) renders inert text styled like a link. */
  @Prop() readonly href?: string;

  /** Native `target`, e.g. `_blank`. */
  @Prop() readonly target?: string;

  /** Native `rel`. Defaults to `noopener noreferrer` when `target="_blank"`. */
  @Prop() readonly rel?: string;

  /** When the underline shows. */
  @Prop() readonly underline: ScarletLinkUnderline = 'hover';

  /** Semantic color of the link. */
  @Prop() readonly color: Color = 'primary';

  /** Renders as inert text — no `href`, `aria-disabled`. */
  @Prop() readonly disabled = false;

  render() {
    const isExternal = this.target === '_blank';
    const rel = this.rel ?? (isExternal ? 'noopener noreferrer' : undefined);

    return (
      <Host class='scarlet-link-host'>
        <a
          class={{
            'scarlet-link': true,
            [`scarlet-link--${this.color}`]: true,
            [`scarlet-link--underline-${this.underline}`]: true,
            'scarlet-link--disabled': this.disabled
          }}
          href={this.disabled ? undefined : this.href}
          target={this.target}
          rel={rel}
          aria-disabled={this.disabled ? 'true' : undefined}
        >
          <slot />
          {isExternal ? (
            <scarlet-icon name='external-link' size='0.85em' class='scarlet-link__icon' />
          ) : null}
        </a>
      </Host>
    );
  }
}
