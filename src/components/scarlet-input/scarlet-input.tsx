import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '../../types';
import { generateId } from '../../utils';

export type ScarletInputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

/**
 * A labeled text input with helper/error text and built-in accessibility wiring.
 */
@Component({
  tag: 'scarlet-input',
  styleUrl: 'scarlet-input.scss',
  shadow: true,
})
export class ScarletInput {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input');
  private readonly helperId = generateId('scarlet-input-helper');
  private readonly errorId = generateId('scarlet-input-error');

  /** Native input type. */
  @Prop() readonly type: ScarletInputType = 'text';

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current value of the input. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder?: string;

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

  /** Makes the input read-only. */
  @Prop() readonly readonly = false;

  /** Marks the input as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the input. */
  @Prop() readonly size: Size = 'md';

  /** Native `autocomplete` attribute. */
  @Prop() readonly autocomplete?: string;

  /** Emitted on every keystroke with the current value. */
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

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.scarletInput.emit(this.value);
  };

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.scarletChange.emit(target.value);
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
      <Host class="scarlet-input-host">
        {this.label ? (
          <label class="scarlet-input__label" htmlFor={this.inputId}>
            {this.label}
            {this.required ? (
              <span class="scarlet-input__required" aria-hidden="true">
                {' '}
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <input
          ref={(el) => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input': true,
            [`scarlet-input--${this.size}`]: true,
            'scarlet-input--invalid': isInvalid,
          }}
          type={this.type}
          name={this.name}
          value={this.value}
          placeholder={this.placeholder}
          disabled={this.disabled}
          readOnly={this.readonly}
          required={this.required}
          autoComplete={this.autocomplete}
          aria-invalid={isInvalid ? 'true' : undefined}
          aria-describedby={describedBy}
          onInput={this.handleInput}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        {this.errorMessage ? (
          <p class="scarlet-input__message scarlet-input__message--error" id={this.errorId} role="alert">
            {this.errorMessage}
          </p>
        ) : this.helperText ? (
          <p class="scarlet-input__message scarlet-input__message--helper" id={this.helperId}>
            {this.helperText}
          </p>
        ) : null}
      </Host>
    );
  }
}
