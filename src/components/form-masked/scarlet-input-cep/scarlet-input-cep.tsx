import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskCEP, onlyDigits } from '@/utils/masks';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A Brazilian postal code (CEP) input — formats as `01310-100`. This
 * component only formats the value; looking up the matching address (e.g.
 * via ViaCEP) is the consuming app's responsibility — listen for
 * `scarletChange` and call your own API with `getRawValue()`.
 */
@Component({
  tag: 'scarlet-input-cep',
  styleUrl: 'scarlet-input-cep.scss',
  shadow: true
})
export class ScarletInputCep {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-cep');
  private readonly helperId = generateId('scarlet-input-cep-helper');
  private readonly errorId = generateId('scarlet-input-cep-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `01310-100`. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = '00000-000';

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

  /**
   * Emitted when the input loses focus after its value has changed. Also
   * emitted as soon as the 8th digit is typed (`scarletComplete`) — the
   * more useful hook for triggering an address lookup without waiting for blur.
   */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted once the value reaches 8 digits (a complete CEP), on every keystroke that keeps it complete. */
  @Event() scarletComplete!: EventEmitter<string>;

  /** Emitted when the input gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the input loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** The raw 8 digits behind the formatted value (e.g. `01310100`). */
  @Method()
  async getRawValue(): Promise<string> {
    return onlyDigits(this.value);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskCEP(target.value);
    this.scarletInput.emit(this.value);
    if (onlyDigits(this.value).length === 8) {
      this.scarletComplete.emit(this.value);
    }
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
      <Host class='scarlet-input-cep-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-cep__label',
          requiredClass: 'scarlet-input-cep__required'
        })}
        <input
          ref={el => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input-cep': true,
            [`scarlet-input-cep--${this.size}`]: true,
            'scarlet-input-cep--invalid': isInvalid
          }}
          type='text'
          inputMode='numeric'
          autoComplete='postal-code'
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
          errorClass: 'scarlet-input-cep__message scarlet-input-cep__message--error',
          helperClass: 'scarlet-input-cep__message scarlet-input-cep__message--helper'
        })}
      </Host>
    );
  }
}
