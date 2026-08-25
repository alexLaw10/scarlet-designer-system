import { Component, Prop, h, Host } from '@stencil/core';
import type { Color } from '@/types';

export type ScarletProgressSize = 'sm' | 'md' | 'lg';

/**
 * A determinate progress bar (0–100%) — for a file upload, a multi-step
 * form, anything with a real, known completion percentage. For an
 * indeterminate "something's happening" state, use `scarlet-spinner`.
 */
@Component({
  tag: 'scarlet-progress',
  styleUrl: 'scarlet-progress.scss',
  shadow: true,
})
export class ScarletProgress {
  /** Current value. */
  @Prop() readonly value = 0;

  /** Value that represents 100%. */
  @Prop() readonly max = 100;

  /** Semantic color of the filled portion. */
  @Prop() readonly color: Color = 'primary';

  /** Height of the track. */
  @Prop() readonly size: ScarletProgressSize = 'md';

  /** Shows the percentage as text next to the track. */
  @Prop() readonly showLabel = false;

  /** Accessible label for the `progressbar` role. */
  @Prop() readonly ariaLabel = 'Progresso';

  render() {
    const percent = this.max > 0 ? Math.min(100, Math.max(0, (this.value / this.max) * 100)) : 0;

    return (
      <Host
        class="scarlet-progress-host"
        role="progressbar"
        aria-valuenow={this.value}
        aria-valuemin="0"
        aria-valuemax={this.max}
        aria-label={this.ariaLabel}
      >
        <div class={{ 'scarlet-progress__track': true, [`scarlet-progress__track--${this.size}`]: true }}>
          <div
            class={{ 'scarlet-progress__fill': true, [`scarlet-progress__fill--${this.color}`]: true }}
            style={{ width: `${percent}%` }}
          />
        </div>
        {this.showLabel ? <span class="scarlet-progress__label">{Math.round(percent)}%</span> : null}
      </Host>
    );
  }
}
