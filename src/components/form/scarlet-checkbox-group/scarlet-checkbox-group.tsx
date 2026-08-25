import { Component, Prop, Watch, Event, type EventEmitter, h, Host, Listen, Element } from '@stencil/core';

interface ScarletCheckboxElement extends HTMLElement {
  value?: string;
  checked: boolean;
  disabled: boolean;
  name?: string;
}

/**
 * Groups a set of `<scarlet-checkbox>` options and coordinates which ones
 * are checked as a single `value` array — unlike `<scarlet-radio-group>`,
 * each checkbox keeps its own native Tab stop (WAI-ARIA's `group` role, not
 * `radiogroup`, doesn't call for roving tabindex/arrow-key navigation the
 * way a radio group does).
 *
 * @slot - Default slot for `<scarlet-checkbox>` children.
 */
@Component({
  tag: 'scarlet-checkbox-group',
  styleUrl: 'scarlet-checkbox-group.scss',
  shadow: true,
})
export class ScarletCheckboxGroup {
  private slotEl?: HTMLSlotElement;

  @Element() el!: HTMLElement;

  /** Name applied to every checkbox in the group, so they submit together in a form. */
  @Prop() readonly name?: string;

  /** Values of the currently checked checkboxes. */
  @Prop({ mutable: true }) value: string[] = [];

  /** Disables every checkbox in the group. */
  @Prop() readonly disabled = false;

  /** Lays the checkboxes out in a row instead of stacked. */
  @Prop() readonly horizontal = false;

  /** Accessible label for the group, when there is no visible heading nearby. */
  @Prop() readonly ariaLabel?: string;

  /** Emitted when the set of checked values changes. */
  @Event() scarletChange!: EventEmitter<string[]>;

  componentDidLoad(): void {
    this.syncChildren();
  }

  // Keeps the children in sync when `value` is set programmatically from
  // outside (e.g. a framework re-rendering after a form reset) — the same
  // gap `scarlet-radio-group` had until it got the same fix.
  @Watch('value')
  handleValueChange(): void {
    this.syncChildren();
  }

  // Listens for scarlet-checkbox's internal-only "scarletCheckboxChange"
  // event, not its public "scarletChange" — see that event's doc comment.
  @Listen('scarletCheckboxChange')
  handleChildChange(event: CustomEvent<boolean>): void {
    const target = event.target as ScarletCheckboxElement | null;
    const isChildCheckbox = target?.tagName?.toLowerCase() === 'scarlet-checkbox';
    if (!target || !isChildCheckbox || target.value === undefined) {
      return;
    }

    const isChecked = event.detail;
    const withoutTarget = this.value.filter((v) => v !== target.value);
    this.value = isChecked ? [...withoutTarget, target.value] : withoutTarget;
    this.syncChildren();
    this.scarletChange.emit(this.value);
  }

  private getCheckboxes(): ScarletCheckboxElement[] {
    return Array.from(this.el.querySelectorAll('scarlet-checkbox')) as unknown as ScarletCheckboxElement[];
  }

  private syncChildren = (): void => {
    this.getCheckboxes().forEach((checkbox) => {
      checkbox.checked = checkbox.value !== undefined && this.value.includes(checkbox.value);
      if (this.name) {
        checkbox.name = this.name;
      }
      if (this.disabled) {
        checkbox.disabled = true;
      }
    });
  };

  // Attached via ref instead of a JSX `onSlotchange` prop, since that event
  // name isn't part of every JSX typings surface for <slot>. Guarded so the
  // listener is only ever attached once, even though `ref` fires on re-renders.
  private handleSlotRef = (el?: HTMLSlotElement): void => {
    if (el && el !== this.slotEl) {
      el.addEventListener('slotchange', this.syncChildren);
    }
    this.slotEl = el;
  };

  render() {
    return (
      <Host
        class={{ 'scarlet-checkbox-group': true, 'scarlet-checkbox-group--horizontal': this.horizontal }}
        role="group"
        aria-label={this.ariaLabel}
      >
        <slot ref={this.handleSlotRef} />
      </Host>
    );
  }
}
