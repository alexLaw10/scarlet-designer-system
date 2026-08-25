import { Component, Prop, State, Event, type EventEmitter, h, Host, Listen, Element } from '@stencil/core';

export type ScarletPopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type ScarletPopoverTriggerMode = 'click' | 'hover';

/**
 * A generic overlay anchored to a trigger element (the `trigger` slot),
 * with arbitrary content in the default slot — the shared primitive
 * `scarlet-menu`/`scarlet-date-picker`/`scarlet-combobox` each built their
 * own narrower version of for their specific popovers. Use this one
 * directly for anything that doesn't need a menu list or a calendar grid:
 * a rich tooltip, a filter panel, a confirmation prompt.
 *
 * `trigger="click"` (the default) toggles on click, closes on Escape or a
 * click outside, and sets `aria-haspopup`/`aria-expanded` on whatever's
 * slotted as the trigger. `trigger="hover"` opens/closes on mouse enter/
 * leave instead, with no click/Escape handling — matching how a hover
 * tooltip behaves, not a dialog.
 *
 * Known limitation: like `scarlet-tooltip`/`scarlet-menu`, positioning is
 * plain CSS anchored to the trigger — it doesn't flip or reposition to stay
 * in the viewport.
 *
 * @slot trigger - The element that opens the popover — for `trigger="click"`, must be a real, natively focusable/activatable element (a `<button>` or `<scarlet-button>`).
 * @slot - The popover's content.
 */
@Component({
  tag: 'scarlet-popover',
  styleUrl: 'scarlet-popover.scss',
  shadow: true,
})
export class ScarletPopover {
  private triggerSlotEl?: HTMLSlotElement;

  @Element() el!: HTMLElement;

  /** Which side of the trigger the popover opens on. */
  @Prop() readonly placement: ScarletPopoverPlacement = 'bottom';

  /** What interaction opens/closes the popover. */
  @Prop() readonly triggerMode: ScarletPopoverTriggerMode = 'click';

  /** Accessible label for the popover content region. */
  @Prop() readonly ariaLabel?: string;

  @State() private open = false;

  /** Emitted after the popover opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /** Emitted after the popover closes. */
  @Event() scarletHide!: EventEmitter<void>;

  componentDidLoad(): void {
    this.syncTrigger();
  }

  disconnectedCallback(): void {
    const trigger = this.getTriggerEl();
    trigger?.removeEventListener('click', this.handleTriggerClick);
    trigger?.removeEventListener('mouseenter', this.handleTriggerEnter);
    trigger?.removeEventListener('mouseleave', this.handleTriggerLeave);
  }

  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent): void {
    if (!this.open || this.triggerMode !== 'click') return;
    if (!event.composedPath().includes(this.el)) {
      this.closePopover();
    }
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open && this.triggerMode === 'click') {
      event.preventDefault();
      this.closePopover();
      this.getTriggerEl()?.focus();
    }
  }

  private getTriggerEl(): HTMLElement | undefined {
    return this.triggerSlotEl?.assignedElements()[0] as HTMLElement | undefined;
  }

  private syncTrigger(): void {
    const trigger = this.getTriggerEl();
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', String(this.open));

    trigger.removeEventListener('click', this.handleTriggerClick);
    trigger.removeEventListener('mouseenter', this.handleTriggerEnter);
    trigger.removeEventListener('mouseleave', this.handleTriggerLeave);

    if (this.triggerMode === 'click') {
      trigger.addEventListener('click', this.handleTriggerClick);
    } else {
      trigger.addEventListener('mouseenter', this.handleTriggerEnter);
      trigger.addEventListener('mouseleave', this.handleTriggerLeave);
    }
  }

  private handleTriggerClick = (): void => {
    if (this.open) {
      this.closePopover();
    } else {
      this.openPopover();
    }
  };

  private handleTriggerEnter = (): void => this.openPopover();
  private handleTriggerLeave = (): void => this.closePopover();

  private handleTriggerSlotChange = (): void => {
    this.syncTrigger();
  };

  private openPopover(): void {
    if (this.open) return;
    this.open = true;
    this.getTriggerEl()?.setAttribute('aria-expanded', 'true');
    this.scarletShow.emit();
  }

  private closePopover(): void {
    if (!this.open) return;
    this.open = false;
    this.getTriggerEl()?.setAttribute('aria-expanded', 'false');
    this.scarletHide.emit();
  }

  private handleTriggerRef = (el?: HTMLSlotElement): void => {
    if (el && el !== this.triggerSlotEl) {
      el.addEventListener('slotchange', this.handleTriggerSlotChange);
    }
    this.triggerSlotEl = el;
  };

  render() {
    return (
      <Host class="scarlet-popover-host">
        <slot name="trigger" ref={this.handleTriggerRef} />
        {this.open ? (
          <div
            class={{ 'scarlet-popover__content': true, [`scarlet-popover__content--${this.placement}`]: true }}
            role="dialog"
            aria-label={this.ariaLabel}
            onMouseEnter={this.triggerMode === 'hover' ? this.handleTriggerEnter : undefined}
            onMouseLeave={this.triggerMode === 'hover' ? this.handleTriggerLeave : undefined}
          >
            <slot />
          </div>
        ) : null}
      </Host>
    );
  }
}
