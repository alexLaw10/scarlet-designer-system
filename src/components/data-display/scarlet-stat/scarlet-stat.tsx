import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletStatTrend = 'up' | 'down' | 'neutral';

/**
 * A single labeled metric — a number/value, its label, and an optional
 * change indicator (e.g. "+12%" with an up/down arrow) for a dashboard.
 */
@Component({
  tag: 'scarlet-stat',
  styleUrl: 'scarlet-stat.scss',
  shadow: true
})
export class ScarletStat {
  /** Label above the value, e.g. "Receita total". */
  @Prop() readonly label = '';

  /** The metric itself, e.g. "R$ 42.900". */
  @Prop() readonly value = '';

  /** Change text, e.g. "+12% vs. mês anterior". Omit to hide the whole change row. */
  @Prop() readonly change?: string;

  /** Direction the change indicates — colors and arrows the change text accordingly. */
  @Prop() readonly trend: ScarletStatTrend = 'neutral';

  render() {
    return (
      <Host class='scarlet-stat-host'>
        <p class='scarlet-stat__label'>{this.label}</p>
        <p class='scarlet-stat__value'>{this.value}</p>
        {this.change ? (
          <p
            class={{ 'scarlet-stat__change': true, [`scarlet-stat__change--${this.trend}`]: true }}
          >
            {this.trend !== 'neutral' ? (
              <scarlet-icon name={this.trend === 'up' ? 'arrow-up' : 'arrow-down'} size='0.85em' />
            ) : null}
            {this.change}
          </p>
        ) : null}
      </Host>
    );
  }
}
