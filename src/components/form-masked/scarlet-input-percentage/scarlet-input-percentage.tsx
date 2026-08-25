import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskPercentage, parsePercentageToNumber } from '@/utils/masks';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A percentage input that formats digits growing from the right, like
 * `scarlet-input-currency` — typing "1234" produces "12,34%". Emits the
 * plain numeric percentage (e.g. `12.34`) via `scarletInput`/`scarletChange`.
 */
@Component({
  tag: 'scarlet-input-percentage',
  styleUrl: 'scarlet-input-percentage.scss',
  shadow: true
})
export class ScarletInputPercentage {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-percentage');
  private readonly helperId = generateId('scarlet-input-percentage-helper');
  private readonly errorId = generateId('scarlet-input-percentage-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `12,34%`. */
  @Prop({ mutable: true }) value = '';

  /** How many digits are kept after the decimal comma. */
  @Prop() readonly decimals = 2;

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = '0,00%';

  /** Visible label rendered above the input. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the input. Hidden while `errorMessage` is set. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the input. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the input as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the input. */
  @Prop() readonly disabled = false;

  /** Marks the input as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the input. */
  @Prop() readonly size: Size = 'md';

  /** Emitted on every keystroke with the current numeric percentage (e.g. `12.34`). */
  @Event() scarletInput!: EventEmitter<number>;

  /** Emitted when the input loses focus after its value has changed, with the current numeric percentage. */
  @Event() scarletChange!: EventEmitter<number>;

  /** Emitted when the input gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the input loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** The current percentage as a plain number (same value `scarletInput`/`scarletChange` emit). */
  @Method()
  async getNumericValue(): Promise<number> {
    return parsePercentageToNumber(this.value);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskPercentage(target.value, this.decimals);
    this.scarletInput.emit(parsePercentageToNumber(this.value));
  };

  private handleChange = (): void => {
    this.scarletChange.emit(parsePercentageToNumber(this.value));
  };

  private handleFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent): void => {
    this.scarletBlur.emit(event);
  };

  render() {
    const isInvalid = this.invalid || Boolean(this.errorMessage);
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });

    return (
      <Host class='scarlet-input-percentage-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-percentage__label',
          requiredClass: 'scarlet-input-percentage__required'
        })}
        <input
          ref={el => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input-percentage': true,
            [`scarlet-input-percentage--${this.size}`]: true,
            'scarlet-input-percentage--invalid': isInvalid
          }}
          type='text'
          inputMode='decimal'
          name={this.name}
          value={this.value}
          placeholder={this.placeholder}
          disabled={this.disabled}
          required={this.required}
          aria-invalid={isInvalid ? 'true' : undefined}
          aria-describedby={describedBy}
          onInput={this.handleInput}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {renderFieldMessage({
          errorMessage: this.errorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-input-percentage__message scarlet-input-percentage__message--error',
          helperClass: 'scarlet-input-percentage__message scarlet-input-percentage__message--helper'
        })}
      </Host>
    );
  }
}
