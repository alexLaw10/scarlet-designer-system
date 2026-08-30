import { Component, Prop, h, Host } from '@stencil/core';
import type { ScarletIconName } from '@/components/foundation/scarlet-icon/icons';

/**
 * A placeholder for a list, search result, or section with nothing to
 * show — an icon, a heading, an optional description, and an optional
 * action (e.g. "Limpar filtros" or "Criar o primeiro item").
 *
 * @slot icon - Overrides `icon` with custom content (e.g. an illustration).
 * @slot action - A `scarlet-button` or similar call to action.
 */
@Component({
  tag: 'scarlet-empty-state',
  styleUrl: 'scarlet-empty-state.scss',
  shadow: true
})
export class ScarletEmptyState {
  /** Icon shown above the heading. Ignored if the `icon` slot has content. */
  @Prop() readonly icon?: ScarletIconName;

  /** Main heading. */
  @Prop() readonly heading = 'Nenhum resultado encontrado.';

  /** Supporting text below the heading. */
  @Prop() readonly description?: string;

  render() {
    return (
      <Host class='scarlet-empty-state-host'>
        <slot name='icon'>
          {this.icon ? (
            <scarlet-icon name={this.icon} size='2.5rem' class='scarlet-empty-state__icon' />
          ) : null}
        </slot>
        <p class='scarlet-empty-state__heading'>{this.heading}</p>
        {this.description ? (
          <p class='scarlet-empty-state__description'>{this.description}</p>
        ) : null}
        <slot name='action' />
      </Host>
    );
  }
}
