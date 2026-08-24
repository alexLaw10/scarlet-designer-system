import { Component, Prop, Event, type EventEmitter, h, Host, Element } from '@stencil/core';

export interface ScarletTabItem {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A set of tabs with associated panels. Panel content is projected via a
 * named slot per item, matching `item.value`.
 *
 * @slot [item.value] - Panel content for each tab, one slot per item value.
 */
@Component({
  tag: 'scarlet-tabs',
  styleUrl: 'scarlet-tabs.scss',
  shadow: true,
})
export class ScarletTabs {
  @Element() el!: HTMLElement;

  /** The tabs to render. */
  @Prop() readonly items: ScarletTabItem[] = [];

  /** Value of the currently selected tab. Defaults to the first enabled item. */
  @Prop({ mutable: true }) value?: string;

  /** Emitted when the selected tab changes. */
  @Event() scarletChange!: EventEmitter<string>;

  componentWillLoad(): void {
    if (!this.value) {
      const firstEnabled = this.items.find((item) => !item.disabled);
      this.value = firstEnabled?.value;
    }
  }

  private selectTab(item: ScarletTabItem, focus = false): void {
    if (item.disabled) return;
    if (this.value !== item.value) {
      this.value = item.value;
      this.scarletChange.emit(this.value);
    }
    if (focus) {
      this.focusTab(item.value);
    }
  }

  private focusTab(value: string): void {
    const tabEl = this.el.shadowRoot?.querySelector<HTMLElement>(`[data-value="${value}"]`);
    tabEl?.focus();
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    const enabledItems = this.items.filter((item) => !item.disabled);
    if (enabledItems.length === 0) return;
    const currentIndex = enabledItems.findIndex((item) => item.value === this.value);

    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledItems.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      this.selectTab(enabledItems[nextIndex], true);
    }
  };

  render() {
    return (
      <Host class="scarlet-tabs-host">
        <div class="scarlet-tabs__list" role="tablist" onKeyDown={this.handleKeyDown}>
          {this.items.map((item) => (
            <button
              type="button"
              key={item.value}
              data-value={item.value}
              class={{
                'scarlet-tabs__tab': true,
                'scarlet-tabs__tab--selected': item.value === this.value,
              }}
              role="tab"
              id={`tab-${item.value}`}
              aria-selected={item.value === this.value ? 'true' : 'false'}
              aria-controls={`panel-${item.value}`}
              disabled={item.disabled}
              tabIndex={item.value === this.value ? 0 : -1}
              onClick={() => this.selectTab(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
        {this.items.map((item) => (
          <div
            key={item.value}
            class="scarlet-tabs__panel"
            role="tabpanel"
            id={`panel-${item.value}`}
            aria-labelledby={`tab-${item.value}`}
            hidden={item.value !== this.value}
          >
            <slot name={item.value} />
          </div>
        ))}
      </Host>
    );
  }
}
