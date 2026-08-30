import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletDividerOrientation = 'horizontal' | 'vertical';

/**
 * A visual separator between sections of content, with an optional centered label.
 */
@Component({
  tag: 'scarlet-divider',
  styleUrl: 'scarlet-divider.scss',
  shadow: true
})
export class ScarletDivider {
  /** Direction of the divider line. */
  @Prop() readonly orientation: ScarletDividerOrientation = 'horizontal';

  /** Optional text rendered centered on the line (horizontal orientation only). */
  @Prop() readonly label?: string;

  render() {
    const hasLabel = this.orientation === 'horizontal' && Boolean(this.label);

    return (
      <Host
        class={{
          'scarlet-divider-host': true,
          [`scarlet-divider-host--${this.orientation}`]: true
        }}
        role='separator'
        aria-orientation={this.orientation}
      >
        {hasLabel
          ? [
              <span class='scarlet-divider__line' key='line-start' />,
              <span class='scarlet-divider__label' key='label'>
                {this.label}
              </span>,
              <span class='scarlet-divider__line' key='line-end' />
            ]
          : null}
      </Host>
    );
  }
}
