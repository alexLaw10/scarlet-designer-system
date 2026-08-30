import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskPhone, onlyDigits, blockNonDigitTyping } from '@/utils/masks';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A Brazilian phone number input — formats as `(11) 91234-5678` (mobile,
 * 11 digits) or `(11) 1234-5678` (landline, 10 digits), switching
 * automatically as the user types.
 */
@Component({
  tag: 'scarlet-input-phone',
  styleUrl: 'scarlet-input-phone.scss',
  shadow: true
})
export class ScarletInputPhone {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-phone');
  private readonly helperId = generateId('scarlet-input-phone-helper');
  private readonly errorId = generateId('scarlet-input-phone-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `(11) 91234-5678`. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = '(11) 91234-5678';

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

  /** Emitted on every keystroke with the current formatted value. */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted when the input loses focus after its value has changed. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the input gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the input loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** The raw digits behind the formatted value (e.g. `11912345678`) — what you'd actually submit to an API. */
  @Method()
  async getRawValue(): Promise<string> {
    return onlyDigits(this.value);
  }

  // Stencil's JSX typings don't include `onBeforeInput` (unlike React's),
  // so it's wired via a plain addEventListener instead of a JSX prop.
  private handleInputRef = (el?: HTMLInputElement): void => {
    if (el && el !== this.inputEl) {
      el.addEventListener('beforeinput', blockNonDigitTyping);
    }
    this.inputEl = el;
  };

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskPhone(target.value);
    this.scarletInput.emit(this.value);
  };

  private handleChange = (): void => {
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
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });

    return (
      <Host class='scarlet-input-phone-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-phone__label',
          requiredClass: 'scarlet-input-phone__required'
        })}
        <input
          ref={this.handleInputRef}
          id={this.inputId}
          class={{
            'scarlet-input-phone': true,
            [`scarlet-input-phone--${this.size}`]: true,
            'scarlet-input-phone--invalid': isInvalid
          }}
          type='text'
          inputMode='tel'
          maxLength={15}
          autoComplete='tel'
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
          errorClass: 'scarlet-input-phone__message scarlet-input-phone__message--error',
          helperClass: 'scarlet-input-phone__message scarlet-input-phone__message--helper'
        })}
      </Host>
    );
  }
}
