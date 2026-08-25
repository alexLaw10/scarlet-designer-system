import { Component, Prop, h, Host } from '@stencil/core';
import { scarletIcons, type ScarletIconName } from './icons';

/**
 * Renders an icon from the design system's shared built-in set. Icons are
 * stroke-based and inherit `color`/`font-size` from their context, so they
 * line up with surrounding text and other components by default.
 *
 * @slot - Custom SVG content, used when `name` is omitted or unrecognized.
 */
@Component({
  tag: 'scarlet-icon',
  styleUrl: 'scarlet-icon.scss',
  shadow: true,
})
export class ScarletIcon {
  /** Name of the built-in icon to render. */
  @Prop() readonly name?: ScarletIconName;

  /** Size of the icon, as any valid CSS length. Defaults to `1em`, so it scales with the surrounding font size. */
  @Prop() readonly size?: string;

  /** Accessible label. Omit for a purely decorative icon (the default) — it is then hidden from assistive tech. */
  @Prop() readonly label?: string;

  render() {
    const renderer = this.name ? scarletIcons[this.name] : undefined;

    return (
      <Host
        class="scarlet-icon-host"
        style={this.size ? { width: this.size, height: this.size } : undefined}
        role={this.label ? 'img' : undefined}
        aria-label={this.label}
        aria-hidden={this.label ? undefined : 'true'}
      >
        {renderer ? (
          <svg
            class="scarlet-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            {renderer()}
          </svg>
        ) : (
          <slot />
        )}
      </Host>
    );
  }
}
