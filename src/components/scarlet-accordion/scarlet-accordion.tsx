import { Component, Prop, Event, type EventEmitter, h, Host, Element } from '@stencil/core';
import { generateId } from '../../utils';

export interface ScarletAccordionItem {
  value: string;
  title: string;
  disabled?: boolean;
}

/**
 * A set of collapsible sections. Panel content is projected via a named
 * slot per item, matching `item.value`.
 *
 * @slot [item.value] - Panel content for each section, one slot per item value.
 */
@Component({
  tag: 'scarlet-accordion',
  styleUrl: 'scarlet-accordion.scss',
  shadow: true,
})
export class ScarletAccordion {
  private readonly idPrefix = generateId('scarlet-accordion');

  @Element() el!: HTMLElement;

  /** The sections to render. */
  @Prop() readonly items: ScarletAccordionItem[] = [];

  /** Allows more than one section to be expanded at the same time. */
  @Prop() readonly multiple = false;

  /** Values of the currently expanded sections. */
  @Prop({ mutable: true }) expandedValues: string[] = [];

  /** Emitted when the set of expanded sections changes. */
  @Event() scarletChange!: EventEmitter<string[]>;

  private isExpanded(value: string): boolean {
    return this.expandedValues.includes(value);
  }

  private toggle(item: ScarletAccordionItem): void {
    if (item.disabled) return;
    const expanded = this.isExpanded(item.value);

    if (this.multiple) {
      this.expandedValues = expanded ? this.expandedValues.filter((value) => value !== item.value) : [...this.expandedValues, item.value];
    } else {
      this.expandedValues = expanded ? [] : [item.value];
    }

    this.scarletChange.emit(this.expandedValues);
  }

  private handleKeyDown = (event: KeyboardEvent, index: number): void => {
    const enabledIndexes = this.items.map((item, i) => (item.disabled ? -1 : i)).filter((i) => i !== -1);
    if (enabledIndexes.length === 0) return;

    const currentPosition = enabledIndexes.indexOf(index);
    let targetIndex: number | null = null;

    if (event.key === 'ArrowDown') {
      targetIndex = enabledIndexes[(currentPosition + 1) % enabledIndexes.length];
    } else if (event.key === 'ArrowUp') {
      targetIndex = enabledIndexes[(currentPosition - 1 + enabledIndexes.length) % enabledIndexes.length];
    } else if (event.key === 'Home') {
      targetIndex = enabledIndexes[0];
    } else if (event.key === 'End') {
      targetIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (targetIndex !== null) {
      event.preventDefault();
      const header = this.el.shadowRoot?.querySelector<HTMLElement>(`[data-index="${targetIndex}"]`);
      header?.focus();
    }
  };

  render() {
    return (
      <Host class="scarlet-accordion-host">
        {this.items.map((item, index) => {
          const expanded = this.isExpanded(item.value);
          const headerId = `${this.idPrefix}-header-${item.value}`;
          const panelId = `${this.idPrefix}-panel-${item.value}`;

          return (
            <div key={item.value} class="scarlet-accordion__item">
              <h3 class="scarlet-accordion__heading">
                <button
                  type="button"
                  data-index={index}
                  id={headerId}
                  class={{ 'scarlet-accordion__trigger': true, 'scarlet-accordion__trigger--expanded': expanded }}
                  aria-expanded={expanded ? 'true' : 'false'}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => this.toggle(item)}
                  onKeyDown={(event) => this.handleKeyDown(event, index)}
                >
                  <svg class="scarlet-accordion__chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <polyline points="9,6 15,12 9,18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <span>{item.title}</span>
                </button>
              </h3>
              <div id={panelId} class="scarlet-accordion__panel" role="region" aria-labelledby={headerId} hidden={!expanded}>
                <div class="scarlet-accordion__panel-inner">
                  <slot name={item.value} />
                </div>
              </div>
            </div>
          );
        })}
      </Host>
    );
  }
}
