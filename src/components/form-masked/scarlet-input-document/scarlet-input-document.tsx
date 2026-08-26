import { Component, Prop, State, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskDocument, onlyDigits, blockNonDigitTyping } from '@/utils/masks';
import { documentType, isValidDocument } from '@/utils/validators';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

export type ScarletDocumentType = 'cpf' | 'cnpj';

/**
 * A single "CPF/CNPJ" field that auto-detects and formats whichever
 * document type is being typed (11 digits → CPF `123.456.789-01`, 12+ →
 * CNPJ `12.345.678/0001-90`) — the common pattern for a field that accepts
 * either an individual or a company.
 */
@Component({
  tag: 'scarlet-input-document',
  styleUrl: 'scarlet-input-document.scss',
  shadow: true
})
export class ScarletInputDocument {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-document');
  private readonly helperId = generateId('scarlet-input-document-helper');
  private readonly errorId = generateId('scarlet-input-document-error');

  /** Set once a complete value fails check-digit validation on blur; cleared as soon as the user edits again. */
  @State() private autoInvalid = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = 'CPF ou CNPJ';

  /** Visible label rendered above the input. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the input. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the input. Takes priority over automatic check-digit validation errors. */
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
   * Validates the CPF/CNPJ check digits on blur once the value is complete
   * (11 or 14 digits), showing a default "CPF/CNPJ inválido" message when
   * they don't check out — unless `errorMessage` is already set, which
   * always wins.
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

  /** The raw digits behind the formatted value. */
  @Method()
  async getRawValue(): Promise<string> {
    return onlyDigits(this.value);
  }

  /** Whether the current value is a complete, check-digit-valid CPF or CNPJ. */
  @Method()
  async isValid(): Promise<boolean> {
    return isValidDocument(this.value);
  }

  /** `'cpf'` or `'cnpj'` based on the current digit count, or `undefined` if empty. */
  @Method()
  async getDocumentType(): Promise<ScarletDocumentType | undefined> {
    return documentType(this.value);
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
    this.value = maskDocument(target.value);
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
      const digitCount = onlyDigits(this.value).length;
      const isComplete = digitCount === 11 || digitCount === 14;
      const valid = !isComplete || isValidDocument(this.value);
      this.autoInvalid = !valid;
      this.scarletValidityChange.emit(valid);
    }
    this.scarletBlur.emit(event);
  };

  private defaultErrorMessage(): string {
    return documentType(this.value) === 'cnpj' ? 'CNPJ inválido.' : 'CPF inválido.';
  }

  render() {
    const effectiveErrorMessage =
      this.errorMessage ?? (this.autoInvalid ? this.defaultErrorMessage() : undefined);
    const isInvalid = this.invalid || Boolean(effectiveErrorMessage);
    const describedBy = computeDescribedBy(effectiveErrorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });

    return (
      <Host class='scarlet-input-document-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-document__label',
          requiredClass: 'scarlet-input-document__required'
        })}
        <input
          ref={this.handleInputRef}
          id={this.inputId}
          class={{
            'scarlet-input-document': true,
            [`scarlet-input-document--${this.size}`]: true,
            'scarlet-input-document--invalid': isInvalid
          }}
          type='text'
          inputMode='numeric'
          maxLength={18}
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
          errorClass: 'scarlet-input-document__message scarlet-input-document__message--error',
          helperClass: 'scarlet-input-document__message scarlet-input-document__message--helper'
        })}
      </Host>
    );
  }
}
