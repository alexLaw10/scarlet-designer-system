import { Component, Prop, State, Event, type EventEmitter, h, Host, Listen } from '@stencil/core';
import { generateId } from '../../utils';

export type ScarletTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/**
 * A text hint shown next to its trigger on hover/focus. Positioning is
 * plain CSS anchored to the host — it does not flip to stay in the
 * viewport, so pick a `placement` that has room to render.
 *
 * @slot - The trigger element (e.g. a button or icon) that shows the tooltip.
 */
@Component({
  tag: 'scarlet-tooltip',
  styleUrl: 'scarlet-tooltip.scss',
  shadow: true,
})
export class ScarletTooltip {
  private readonly tooltipId = generateId('scarlet-tooltip');
  private showTimeout?: ReturnType<typeof setTimeout>;

  @State() private visible = false;

  /** Text content of the tooltip. */
  @Prop() readonly content?: string;

  /** Where the tooltip renders relative to its trigger. */
  @Prop() readonly placement: ScarletTooltipPlacement = 'top';

  /** Delay in milliseconds before the tooltip appears. */
  @Prop() readonly delay = 200;

  /** Disables the tooltip entirely. */
  @Prop() readonly disabled = false;

  /** Emitted when the tooltip becomes visible. */
  @Event() scarletShow!: EventEmitter<void>;

  /** Emitted when the tooltip is hidden. */
  @Event() scarletHide!: EventEmitter<void>;

  disconnectedCallback(): void {
    clearTimeout(this.showTimeout);
  }

  @Listen('mouseover')
  @Listen('focusin')
  handleShow(): void {
    if (this.disabled || this.visible) return;
    clearTimeout(this.showTimeout);
    this.showTimeout = setTimeout(() => {
      this.visible = true;
      this.scarletShow.emit();
    }, this.delay);
  }

  @Listen('mouseout')
  @Listen('focusout')
  handleHide(): void {
    clearTimeout(this.showTimeout);
    if (this.visible) {
      this.visible = false;
      this.scarletHide.emit();
    }
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.handleHide();
    }
  }

  render() {
    return (
      <Host class="scarlet-tooltip-host" aria-describedby={this.visible ? this.tooltipId : undefined}>
        <slot />
        <span
          id={this.tooltipId}
          role="tooltip"
          class={{
            'scarlet-tooltip': true,
            [`scarlet-tooltip--${this.placement}`]: true,
            'scarlet-tooltip--visible': this.visible && !this.disabled,
          }}
        >
          {this.content}
        </span>
      </Host>
    );
  }
}
