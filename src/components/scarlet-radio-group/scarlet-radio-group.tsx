import { Component, Prop, Event, type EventEmitter, h, Host, Listen, Element } from '@stencil/core';

interface ScarletRadioElement extends HTMLElement {
  value?: string;
  checked: boolean;
  disabled: boolean;
  name?: string;
}

/**
 * Groups a set of `<scarlet-radio>` options and enforces single selection —
 * native browser radio grouping does not cross shadow-DOM boundaries, so
 * this component coordinates `checked`/`name`/`disabled` across its children.
 *
 * @slot - Default slot for `<scarlet-radio>` children.
 */
@Component({
  tag: 'scarlet-radio-group',
  styleUrl: 'scarlet-radio-group.scss',
  shadow: true,
})
export class ScarletRadioGroup {
  @Element() el!: HTMLElement;

  /** Name applied to every radio in the group, so they submit together in a form. */
  @Prop() readonly name?: string;

  /** Value of the currently selected radio. */
  @Prop({ mutable: true }) value?: string;

  /** Disables every radio in the group. */
  @Prop() readonly disabled = false;

  /** Lays the radios out in a row instead of stacked. */
  @Prop() readonly horizontal = false;

  /** Accessible label for the group, when there is no visible heading nearby. */
  @Prop() readonly ariaLabel?: string;

  /** Emitted when the selected value changes. */
  @Event() scarletChange!: EventEmitter<string | undefined>;

  componentDidLoad(): void {
    this.syncChildren();
  }

  @Listen('scarletChange')
  handleChildChange(event: CustomEvent<boolean>): void {
    const target = event.target as ScarletRadioElement | null;
    const isChildRadio = target?.tagName?.toLowerCase() === 'scarlet-radio';
    if (!target || !isChildRadio || !event.detail) {
      return;
    }
    event.stopPropagation();
    this.value = target.value;
    this.syncChildren();
    this.scarletChange.emit(this.value);
  }

  private getRadios(): ScarletRadioElement[] {
    return Array.from(this.el.querySelectorAll('scarlet-radio')) as unknown as ScarletRadioElement[];
  }

  private syncChildren = (): void => {
    this.getRadios().forEach((radio) => {
      radio.checked = radio.value === this.value;
      if (this.name) {
        radio.name = this.name;
      }
      if (this.disabled) {
        radio.disabled = true;
      }
    });
  };

  render() {
    return (
      <Host
        class={{ 'scarlet-radio-group': true, 'scarlet-radio-group--horizontal': this.horizontal }}
        role="radiogroup"
        aria-label={this.ariaLabel}
      >
        <slot onSlotchange={this.syncChildren} />
      </Host>
    );
  }
}
