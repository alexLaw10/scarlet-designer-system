import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletSpinnerVariant = 'circle' | 'logo';
export type ScarletSpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * A loading indicator — `variant="circle"` for the generic spinner (the
 * same shape `scarlet-button`'s own `loading` state uses), `variant="logo"`
 * for the Scarlet mark itself pulsing, e.g. for a full-page loading state.
 * `role="status"` with `label` as its accessible name, so assistive tech
 * announces the loading state without needing separate visible text.
 */
@Component({
  tag: 'scarlet-spinner',
  styleUrl: 'scarlet-spinner.scss',
  shadow: true
})
export class ScarletSpinner {
  /** Which loading indicator to show. */
  @Prop() readonly variant: ScarletSpinnerVariant = 'circle';

  /** Size of the indicator. */
  @Prop() readonly size: ScarletSpinnerSize = 'md';

  /** Accessible label, announced by assistive tech via `role="status"`. */
  @Prop() readonly label: string = 'Carregando';

  render() {
    return (
      <Host
        class={{ 'scarlet-spinner-host': true, [`scarlet-spinner-host--${this.size}`]: true }}
        role='status'
        aria-label={this.label}
      >
        {this.variant === 'logo' ? (
          // Literal brand colors, not the --scarlet-color-primary-* tokens:
          // this reproduces the actual logo mark (see .storybook/brand/
          // scarllet-mark.svg), which isn't the same red as the UI accent
          // scale a rebrand could tune independently later.
          <svg class='scarlet-spinner__logo' viewBox='0 0 400 400' aria-hidden='true'>
            <g transform='translate(200,200) scale(1.6)'>
              <polygon points='0,-112 90,0 36,0 0,-42' fill='#ec3013' />
              <polygon points='90,0 0,112 0,42 36,0' fill='#c1240c' />
              <polygon points='0,112 -90,0 -36,0 0,42' fill='#ff5a3c' />
              <polygon points='-90,0 0,-112 0,-42 -36,0' fill='#8f1a07' />
              <polygon points='0,-42 36,0 0,42 -36,0' fill='#f3f2f2' />
              <polygon
                points='0,-112 90,0 0,112 -90,0'
                fill='none'
                stroke='#201e1d'
                stroke-width='4'
              />
            </g>
          </svg>
        ) : (
          <span class='scarlet-spinner__circle' aria-hidden='true' />
        )}
      </Host>
    );
  }
}
