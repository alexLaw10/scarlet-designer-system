import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskCurrency, parseCurrencyToNumber } from '@/utils/masks';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A monetary input that formats digits as currency growing from the right
 * (like a card machine) — typing "1234" produces "R$ 12,34". Unlike the
 * other masked inputs, `scarletInput`/`scarletChange` emit the plain
 * **numeric** amount (e.g. `12.34`), not the formatted string — that's
 * almost always what you actually want from a money field. Read the
 * formatted text itself via `value`.
 */
@Component({
  tag: 'scarlet-input-currency',
  styleUrl: 'scarlet-input-currency.scss',
  shadow: true,
})
export class ScarletInputCurrency {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-currency');
  private readonly helperId = generateId('scarlet-input-currency-helper');
  private readonly errorId = generateId('scarlet-input-currency-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `R$ 1.234,56`. */
  @Prop({ mutable: true }) value = '';

  /** Currency symbol shown before the amount. */
  @Prop() readonly currencySymbol = 'R$';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = 'R$ 0,00';

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

  /** Emitted on every keystroke with the current numeric amount (e.g. `12.34`). */
  @Event() scarletInput!: EventEmitter<number>;

  /** Emitted when the input loses focus after its value has changed, with the current numeric amount. */
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

  /** The current amount as a plain number (same value `scarletInput`/`scarletChange` emit). */
  @Method()
  async getNumericValue(): Promise<number> {
    return parseCurrencyToNumber(this.value);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskCurrency(target.value, this.currencySymbol);
    this.scarletInput.emit(parseCurrencyToNumber(this.value));
  };

  private handleChange = (): void => {
    this.scarletChange.emit(parseCurrencyToNumber(this.value));
  };

  private handleFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent): void => {
    this.scarletBlur.emit(event);
  };

  render() {
    const isInvalid = this.invalid || Boolean(this.errorMessage);
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });

    return (
      <Host class="scarlet-input-currency-host">
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-currency__label',
          requiredClass: 'scarlet-input-currency__required',
        })}
        <input
          ref={(el) => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input-currency': true,
            [`scarlet-input-currency--${this.size}`]: true,
            'scarlet-input-currency--invalid': isInvalid,
          }}
          type="text"
          inputMode="decimal"
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
          errorClass: 'scarlet-input-currency__message scarlet-input-currency__message--error',
          helperClass: 'scarlet-input-currency__message scarlet-input-currency__message--helper',
        })}
      </Host>
    );
  }
}
