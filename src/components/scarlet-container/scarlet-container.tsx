import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletContainerMaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/**
 * A centered, max-width content wrapper — the outermost layout primitive
 * for page sections.
 *
 * @slot - The page content.
 */
@Component({
  tag: 'scarlet-container',
  styleUrl: 'scarlet-container.scss',
  shadow: true,
})
export class ScarletContainer {
  /** Maximum width of the container. */
  @Prop() readonly maxWidth: ScarletContainerMaxWidth = 'lg';

  /** Adds horizontal padding. */
  @Prop() readonly padding = true;

  /** Centers the container horizontally within its parent. */
  @Prop() readonly center = true;

  render() {
    return (
      <Host
        class={{
          'scarlet-container-host': true,
          [`scarlet-container-host--${this.maxWidth}`]: true,
          'scarlet-container-host--padding': this.padding,
          'scarlet-container-host--center': this.center,
        }}
      >
        <slot />
      </Host>
    );
  }
}
