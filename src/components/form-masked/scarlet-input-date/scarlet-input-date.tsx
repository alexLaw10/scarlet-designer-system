import { Component, Prop, State, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskDate, onlyDigits } from '@/utils/masks';
import { isValidDateBR } from '@/utils/validators';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A `DD/MM/AAAA` date input. Unlike a plain positional mask, `validate`
 * checks it's a *real* calendar date (rejects `31/02/2026`, honors leap
 * years) on blur, not just that 8 digits were typed.
 */
@Component({
  tag: 'scarlet-input-date',
  styleUrl: 'scarlet-input-date.scss',
  shadow: true
})
export class ScarletInputDate {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-date');
  private readonly helperId = generateId('scarlet-input-date-helper');
  private readonly errorId = generateId('scarlet-input-date-error');

  /** Set once a complete value fails calendar validation on blur; cleared as soon as the user edits again. */
  @State() private autoInvalid = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `31/12/2026`. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = 'DD/MM/AAAA';

  /** Visible label rendered above the input. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the input. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the input. Takes priority over automatic calendar validation errors. */
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
   * Validates the value is a real calendar date on blur once it's complete
   * (8 digits), showing a default "Data inválida" message when it isn't —
   * unless `errorMessage` is already set, which always wins.
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

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** Whether the current value is a complete, real calendar date. */
  @Method()
  async isValid(): Promise<boolean> {
    return isValidDateBR(this.value);
  }

  /** The value as a native `Date`, or `undefined` if it isn't a complete valid date. */
  @Method()
  async toDate(): Promise<Date | undefined> {
    if (!isValidDateBR(this.value)) return undefined;
    const digits = onlyDigits(this.value);
    const day = Number(digits.slice(0, 2));
    const month = Number(digits.slice(2, 4));
    const year = Number(digits.slice(4, 8));
    return new Date(year, month - 1, day);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskDate(target.value);
    this.autoInvalid = false;
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
      const isComplete = onlyDigits(this.value).length === 8;
      const valid = !isComplete || isValidDateBR(this.value);
      this.autoInvalid = !valid;
      this.scarletValidityChange.emit(valid);
    }
    this.scarletBlur.emit(event);
  };

  render() {
    const effectiveErrorMessage =
      this.errorMessage ?? (this.autoInvalid ? 'Data inválida.' : undefined);
    const isInvalid = this.invalid || Boolean(effectiveErrorMessage);
    const describedBy = computeDescribedBy(effectiveErrorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });

    return (
      <Host class='scarlet-input-date-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-date__label',
          requiredClass: 'scarlet-input-date__required'
        })}
        <input
          ref={el => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input-date': true,
            [`scarlet-input-date--${this.size}`]: true,
            'scarlet-input-date--invalid': isInvalid
          }}
          type='text'
          inputMode='numeric'
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
          errorMessage: effectiveErrorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-input-date__message scarlet-input-date__message--error',
          helperClass: 'scarlet-input-date__message scarlet-input-date__message--helper'
        })}
      </Host>
    );
  }
}
