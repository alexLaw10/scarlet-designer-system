import { Component, Prop, State, Event, type EventEmitter, h, Host, Listen, Element } from '@stencil/core';

export interface ScarletMenuItem {
  value: string;
  label: string;
  disabled?: boolean;
  /** Styles the item as a destructive action (e.g. "Excluir"). */
  danger?: boolean;
}

/**
 * A dropdown menu of actions opened from an arbitrary trigger element (the
 * `trigger` slot — typically an icon button like "⋮"), following the
 * WAI-ARIA menu button pattern: the trigger gets `aria-haspopup="menu"`/
 * `aria-expanded` (set directly on whatever element is slotted in), the
 * popover is `role="menu"` with `role="menuitem"` buttons, arrow keys move
 * a roving tab stop within the list, Home/End jump to the first/last enabled
 * item, Escape closes and returns focus to the trigger. Enter/Space opening
 * the menu is *not* handled here — the trigger must be a real, natively
 * activatable element (a `<button>` or `<scarlet-button>`); its own native
 * click already opens the menu, and re-handling those keys here would fire
 * twice (open, then immediately close again from the resulting click).
 *
 * Known limitation: like `scarlet-tooltip`/`scarlet-date-picker`,
 * positioning is plain CSS anchored to the trigger — it doesn't flip or
 * reposition to stay in the viewport, and it doesn't close on Tab-ing past
 * its last item.
 *
 * @slot trigger - The element that opens the menu — must be a real, natively focusable/activatable element (a `<button>` or `<scarlet-button>`).
 */
@Component({
  tag: 'scarlet-menu',
  styleUrl: 'scarlet-menu.scss',
  shadow: true,
})
export class ScarletMenu {
  private triggerSlotEl?: HTMLSlotElement;
  private focusedItemEl?: HTMLButtonElement;
  /** Set right before a render that should move real DOM focus into the menu, e.g. after opening or an arrow-key move. Consumed in `componentDidRender`. */
  private shouldFocusMenu = false;

  @Element() el!: HTMLElement;

  /** The actions to list. */
  @Prop() readonly items: ScarletMenuItem[] = [];

  /** Accessible label for the menu list, when the trigger's own accessible name doesn't already describe it. */
  @Prop() readonly ariaLabel = 'Menu';

  /** Which side of the trigger the menu aligns to. */
  @Prop() readonly placement: 'start' | 'end' = 'start';

  @State() private open = false;
  @State() private focusedValue?: string;

  /** Emitted when an enabled item is picked. The menu closes right after. */
  @Event() scarletSelect!: EventEmitter<ScarletMenuItem>;

  /** Emitted after the menu opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /** Emitted after the menu closes. */
  @Event() scarletHide!: EventEmitter<void>;

  componentDidLoad(): void {
    this.syncTrigger();
  }

  componentDidRender(): void {
    if (this.shouldFocusMenu && this.open) {
      this.focusedItemEl?.focus();
      this.shouldFocusMenu = false;
    }
  }

  disconnectedCallback(): void {
    this.getTriggerEl()?.removeEventListener('click', this.handleTriggerClick);
  }

  // Closes on any click outside the component's own host — composedPath()
  // (unlike event.target) survives shadow-DOM retargeting, so this reliably
  // tells outside clicks apart from a click on the trigger or a menu item.
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!event.composedPath().includes(this.el)) {
      this.closeMenu();
    }
  }

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    const trigger = this.getTriggerEl();
    const path = event.composedPath();

    if (!this.open) {
      if (trigger && path.includes(trigger) && event.key === 'ArrowDown') {
        event.preventDefault();
        this.openMenu();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      trigger?.focus();
      return;
    }

    const enabledItems = this.items.filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;
    const currentIndex = enabledItems.findIndex((item) => item.value === this.focusedValue);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledItems.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex === -1 ? enabledItems.length - 1 : (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    this.focusedValue = enabledItems[nextIndex].value;
    this.shouldFocusMenu = true;
  }

  private getTriggerEl(): HTMLElement | undefined {
    return this.triggerSlotEl?.assignedElements()[0] as HTMLElement | undefined;
  }

  private syncTrigger(): void {
    const trigger = this.getTriggerEl();
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'menu');
    trigger.setAttribute('aria-expanded', String(this.open));
    trigger.removeEventListener('click', this.handleTriggerClick);
    trigger.addEventListener('click', this.handleTriggerClick);
  }

  private handleTriggerClick = (): void => {
    if (this.open) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  };

  private handleTriggerSlotChange = (): void => {
    this.syncTrigger();
  };

  private openMenu(): void {
    if (this.open) return;
    const enabledItems = this.items.filter((item) => !item.disabled);
    this.focusedValue = enabledItems[0]?.value;
    this.open = true;
    this.shouldFocusMenu = true;
    this.getTriggerEl()?.setAttribute('aria-expanded', 'true');
    this.scarletShow.emit();
  }

  private closeMenu(): void {
    if (!this.open) return;
    this.open = false;
    this.getTriggerEl()?.setAttribute('aria-expanded', 'false');
    this.scarletHide.emit();
  }

  private selectItem = (item: ScarletMenuItem): void => {
    if (item.disabled) return;
    this.scarletSelect.emit(item);
    this.closeMenu();
    this.getTriggerEl()?.focus();
  };

  private handleTriggerRef = (el?: HTMLSlotElement): void => {
    if (el && el !== this.triggerSlotEl) {
      el.addEventListener('slotchange', this.handleTriggerSlotChange);
    }
    this.triggerSlotEl = el;
  };

  render() {
    return (
      <Host class="scarlet-menu-host">
        <slot name="trigger" ref={this.handleTriggerRef} />
        {this.open ? (
          <div
            class={{
              'scarlet-menu__list': true,
              [`scarlet-menu__list--${this.placement}`]: true,
            }}
            role="menu"
            aria-label={this.ariaLabel}
          >
            {this.items.map((item) => (
              <button
                type="button"
                class={{
                  'scarlet-menu__item': true,
                  'scarlet-menu__item--danger': Boolean(item.danger),
                }}
                role="menuitem"
                tabIndex={item.value === this.focusedValue ? 0 : -1}
                disabled={item.disabled}
                ref={(el) => {
                  if (item.value === this.focusedValue) this.focusedItemEl = el;
                }}
                onClick={() => this.selectItem(item)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ) : null}
      </Host>
    );
  }
}
