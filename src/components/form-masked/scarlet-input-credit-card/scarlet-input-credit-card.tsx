import { Component, Prop, State, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskCreditCard, onlyDigits } from '@/utils/masks';
import { type CreditCardBrand, detectCardBrand, isValidCreditCardLuhn } from '@/utils/validators';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A credit card number input — formats in groups of 4 (or Amex's 4-6-5 /
 * Diners' 4-6-4 grouping once that brand is detected from the card's
 * BIN/IIN prefix), with a Luhn checksum validation on blur.
 */
@Component({
  tag: 'scarlet-input-credit-card',
  styleUrl: 'scarlet-input-credit-card.scss',
  shadow: true,
})
export class ScarletInputCreditCard {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-credit-card');
  private readonly helperId = generateId('scarlet-input-credit-card-helper');
  private readonly errorId = generateId('scarlet-input-credit-card-error');

  /** Set once a complete value fails the Luhn checksum on blur; cleared as soon as the user edits again. */
  @State() private autoInvalid = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = '0000 0000 0000 0000';

  /** Visible label rendered above the input. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the input. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the input. Takes priority over automatic Luhn validation errors. */
  @Prop() readonly errorMessage?: string;

  /** Marks the input as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the input. */
  @Prop() readonly disabled = false;

  /** Marks the input as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the input. */
  @Prop() readonly size: Size = 'md';

  /**
   * Validates the number against the Luhn checksum on blur once it's
   * complete, showing a default "Número de cartão inválido" message when
   * it fails — unless `errorMessage` is already set, which always wins.
   */
  @Prop() readonly validate = true;

  /** Emitted on every keystroke with the current formatted value. */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted when the input loses focus after its value has changed. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the input gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the input loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Emitted after a `validate`-triggered check, with the resulting validity. */
  @Event() scarletValidityChange!: EventEmitter<boolean>;

  /** Emitted whenever the detected card brand changes (including to `undefined`). */
  @Event() scarletBrandChange!: EventEmitter<CreditCardBrand | undefined>;

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** The raw digits behind the formatted value. */
  @Method()
  async getRawValue(): Promise<string> {
    return onlyDigits(this.value);
  }

  /** Whether the current value passes the Luhn checksum. */
  @Method()
  async isValid(): Promise<boolean> {
    return isValidCreditCardLuhn(this.value);
  }

  /** The detected card network (`'visa'`, `'mastercard'`, ...), or `undefined` if not yet recognizable. */
  @Method()
  async getBrand(): Promise<CreditCardBrand | undefined> {
    return detectCardBrand(this.value);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    const previousBrand = detectCardBrand(this.value);
    const brand = detectCardBrand(target.value);
    this.value = maskCreditCard(target.value, brand === 'amex' ? 'amex' : brand === 'diners' ? 'diners' : undefined);
    this.autoInvalid = false;
    if (brand !== previousBrand) {
      this.scarletBrandChange.emit(brand);
    }
    this.scarletInput.emit(this.value);
  };

  private handleChange = (): void => {
    this.scarletChange.emit(this.value);
  };

  private handleFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
  };

  private handleBlur = (event: FocusEvent): void => {
    if (this.validate) {
      const digitCount = onlyDigits(this.value).length;
      const isComplete = digitCount >= 12;
      const valid = !isComplete || isValidCreditCardLuhn(this.value);
      this.autoInvalid = !valid;
      this.scarletValidityChange.emit(valid);
    }
    this.scarletBlur.emit(event);
  };

  render() {
    const effectiveErrorMessage = this.errorMessage ?? (this.autoInvalid ? 'Número de cartão inválido.' : undefined);
    const isInvalid = this.invalid || Boolean(effectiveErrorMessage);
    const describedBy = computeDescribedBy(effectiveErrorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });
    const brand = detectCardBrand(this.value);

    return (
      <Host class="scarlet-input-credit-card-host">
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-credit-card__label',
          requiredClass: 'scarlet-input-credit-card__required',
        })}
        <div class="scarlet-input-credit-card__wrapper">
          <input
            ref={(el) => (this.inputEl = el)}
            id={this.inputId}
            class={{
              'scarlet-input-credit-card': true,
              [`scarlet-input-credit-card--${this.size}`]: true,
              'scarlet-input-credit-card--invalid': isInvalid,
            }}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
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
          {brand ? (
            <span class="scarlet-input-credit-card__brand" aria-hidden="true">
              {brand}
            </span>
          ) : null}
        </div>
        {renderFieldMessage({
          errorMessage: effectiveErrorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-input-credit-card__message scarlet-input-credit-card__message--error',
          helperClass: 'scarlet-input-credit-card__message scarlet-input-credit-card__message--helper',
        })}
      </Host>
    );
  }
}
