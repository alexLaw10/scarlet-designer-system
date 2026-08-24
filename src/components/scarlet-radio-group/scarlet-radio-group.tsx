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
  private slotEl?: HTMLSlotElement;

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

  // capture: true is load-bearing, not just stopImmediatePropagation: the
  // group re-emits its own scarletChange on this same element once it's
  // done processing the child's event, so the original event must never
  // reach a bubble-phase listener here (e.g. a consumer's addEventListener).
  // Per the DOM spec, a capture-phase listener on an ancestor always runs
  // before any bubble-phase listener on that same node, regardless of
  // registration order — stopImmediatePropagation alone depends on that
  // order and isn't reliable here.
  @Listen('scarletChange', { capture: true })
  handleChildChange(event: CustomEvent<boolean>): void {
    const target = event.target as ScarletRadioElement | null;
    const isChildRadio = target?.tagName?.toLowerCase() === 'scarlet-radio';
    if (!target || !isChildRadio || !event.detail) {
      return;
    }
    event.stopImmediatePropagation();
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
        class={{ 'scarlet-radio-group': true, 'scarlet-radio-group--horizontal': this.horizontal }}
        role="radiogroup"
        aria-label={this.ariaLabel}
      >
        <slot ref={this.handleSlotRef} />
      </Host>
    );
  }
}
