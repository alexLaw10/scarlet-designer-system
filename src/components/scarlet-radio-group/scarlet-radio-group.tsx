import { Component, Prop, Event, type EventEmitter, h, Host, Listen, Element } from '@stencil/core';

interface ScarletRadioElement extends HTMLElement {
  value?: string;
  checked: boolean;
  disabled: boolean;
  name?: string;
  focusable: boolean;
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

  // Listens for scarlet-radio's internal-only "scarletRadioChange" event,
  // not its public "scarletChange" — a consumer's own addEventListener for
  // "scarletChange" on this group would otherwise also catch the child's
  // bubbling event (boolean detail) in addition to the group's own (string
  // detail) re-emission below, firing twice with the wrong detail on the
  // first hit. Different event names avoids that collision outright,
  // without depending on stopPropagation/capture-phase ordering (which
  // turned out not to reliably prevent it here) or on a raw native event
  // crossing the shadow boundary on a manual dispatch (which turned out not
  // to reliably happen here either — Stencil's own EventEmitter does).
  @Listen('scarletRadioChange')
  handleChildChange(event: CustomEvent<boolean>): void {
    const target = event.target as ScarletRadioElement | null;
    const isChildRadio = target?.tagName?.toLowerCase() === 'scarlet-radio';
    if (!target || !isChildRadio || !event.detail) {
      return;
    }
    this.value = target.value;
    this.syncChildren();
    this.scarletChange.emit(this.value);
  }

  // Implements the WAI-ARIA radiogroup keyboard pattern: the group has a
  // single Tab stop (roving tabindex — one radio at a time is focusable(),
  // computed below), and arrow keys move both focus and selection among the
  // enabled radios, matching how native <input type="radio"> groups behave.
  // Without this, each <scarlet-radio> would keep its own independent tab
  // stop (they can't be natively grouped by `name` across shadow-DOM
  // boundaries), forcing keyboard users to Tab through every single option.
  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent): void {
    const radios = this.getRadios().filter((radio) => !radio.disabled);
    if (radios.length === 0) return;

    const currentIndex = radios.findIndex((radio) => radio.value === this.value);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % radios.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = currentIndex === -1 ? radios.length - 1 : (currentIndex - 1 + radios.length) % radios.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = radios.length - 1;
    }

    if (nextIndex === null) return;

    event.preventDefault();
    const nextRadio = radios[nextIndex];
    this.value = nextRadio.value;
    this.syncChildren();
    this.scarletChange.emit(this.value);
    nextRadio.shadowRoot?.querySelector('input')?.focus();
  }

  private getRadios(): ScarletRadioElement[] {
    return Array.from(this.el.querySelectorAll('scarlet-radio')) as unknown as ScarletRadioElement[];
  }

  private syncChildren = (): void => {
    const radios = this.getRadios();
    const checkedRadio = radios.find((radio) => radio.value === this.value);
    const focusTarget = checkedRadio ?? radios.find((radio) => !radio.disabled) ?? radios[0];

    radios.forEach((radio) => {
      radio.checked = radio.value === this.value;
      radio.focusable = radio === focusTarget;
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
