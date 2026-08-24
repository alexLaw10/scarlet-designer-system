import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '../../types';
import { generateId } from '../../utils';

export interface ScarletSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

/**
 * A labeled native `<select>` dropdown with helper/error text and built-in
 * accessibility wiring. Options are passed as a `options` property (an
 * array), not slotted — native `<select>` cannot reliably project slotted
 * `<option>` elements into its picker UI across browsers.
 */
@Component({
  tag: 'scarlet-select',
  styleUrl: 'scarlet-select.scss',
  shadow: true,
})
export class ScarletSelect {
  private selectEl?: HTMLSelectElement;
  private readonly selectId = generateId('scarlet-select');
  private readonly helperId = generateId('scarlet-select-helper');
  private readonly errorId = generateId('scarlet-select-error');

  /** Options rendered inside the select. */
  @Prop() readonly options: ScarletSelectOption[] = [];

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Currently selected value. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder shown as a disabled first option when no value is selected. */
  @Prop() readonly placeholder?: string;

  /** Visible label rendered above the select. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the select. Hidden while `errorMessage` is set. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the select. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the select as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the select. */
  @Prop() readonly disabled = false;

  /** Marks the select as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the select. */
  @Prop() readonly size: Size = 'md';

  /** Emitted when the selected value changes. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the select gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the select loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Focuses the internal select element. */
  @Method()
  async setFocus(): Promise<void> {
    this.selectEl?.focus();
  }

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLSelectElement;
    this.value = target.value;
    this.scarletChange.emit(this.value);
  };

  private handleFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent): void => {
    this.scarletBlur.emit(event);
  };

  render() {
    const isInvalid = this.invalid || Boolean(this.errorMessage);
    const describedBy =
      [this.errorMessage ? this.errorId : null, !this.errorMessage && this.helperText ? this.helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <Host class="scarlet-select-host">
        {this.label ? (
          <label class="scarlet-select__label" htmlFor={this.selectId}>
            {this.label}
            {this.required ? (
              <span class="scarlet-select__required" aria-hidden="true">
                {' '}
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div class="scarlet-select__wrapper">
          <select
            ref={(el) => (this.selectEl = el)}
            id={this.selectId}
            class={{
              'scarlet-select': true,
              [`scarlet-select--${this.size}`]: true,
              'scarlet-select--invalid': isInvalid,
              'scarlet-select--placeholder': !this.value && Boolean(this.placeholder),
            }}
            name={this.name}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          >
            {this.placeholder ? (
              <option value="" disabled hidden={this.required} selected={!this.value}>
                {this.placeholder}
              </option>
            ) : null}
            {this.options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled} selected={option.value === this.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg class="scarlet-select__chevron" viewBox="0 0 24 24" aria-hidden="true">
            <polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        {this.errorMessage ? (
          <p class="scarlet-select__message scarlet-select__message--error" id={this.errorId} role="alert">
            {this.errorMessage}
          </p>
        ) : this.helperText ? (
          <p class="scarlet-select__message scarlet-select__message--helper" id={this.helperId}>
            {this.helperText}
          </p>
        ) : null}
      </Host>
    );
  }
}
