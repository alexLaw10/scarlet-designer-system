import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A numeric input with decrement/increment buttons — for a quantity field,
 * not a general-purpose text field that happens to hold numbers (that's
 * `scarlet-input type="number"`). Stays within `min`/`max` on every path:
 * the buttons, typing, and blur all clamp.
 */
@Component({
  tag: 'scarlet-number-input',
  styleUrl: 'scarlet-number-input.scss',
  shadow: true
})
export class ScarletNumberInput {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-number-input');
  private readonly helperId = generateId('scarlet-number-input-helper');
  private readonly errorId = generateId('scarlet-number-input-error');

  /** Current value. */
  @Prop({ mutable: true }) value = 0;

  /** Lower bound. Omit for no minimum. */
  @Prop() readonly min?: number;

  /** Upper bound. Omit for no maximum. */
  @Prop() readonly max?: number;

  /** Amount each +/- click changes the value by. */
  @Prop() readonly step = 1;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Visible label rendered above the field. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the field. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the field. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the field as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the field and both buttons. */
  @Prop() readonly disabled = false;

  /** Marks the field as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the field. */
  @Prop() readonly size: Size = 'md';

  /** Emitted on every keystroke, with the raw (not yet clamped) numeric value. */
  @Event() scarletInput!: EventEmitter<number>;

  /** Emitted when the value is committed — a +/- click, or the field losing focus — always clamped to `min`/`max`. */
  @Event() scarletChange!: EventEmitter<number>;

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  private clamp(raw: number): number {
    let next = raw;
    if (this.min !== undefined) next = Math.max(this.min, next);
    if (this.max !== undefined) next = Math.min(this.max, next);
    return next;
  }

  private commit(next: number): void {
    const clamped = this.clamp(next);
    this.value = clamped;
    this.scarletChange.emit(clamped);
  }

  private handleDecrement = (): void => {
    if (this.disabled) return;
    this.commit(this.value - this.step);
  };

  private handleIncrement = (): void => {
    if (this.disabled) return;
    this.commit(this.value + this.step);
  };

  private handleInput = (event: Event): void => {
    const raw = (event.target as HTMLInputElement).value;
    const parsed = raw === '' || raw === '-' ? 0 : Number(raw);
    if (Number.isNaN(parsed)) return;
    this.value = parsed;
    this.scarletInput.emit(parsed);
  };

  private handleBlur = (): void => {
    this.commit(this.value);
  };

  render() {
    const isInvalid = this.invalid || Boolean(this.errorMessage);
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });
    const atMin = this.min !== undefined && this.value <= this.min;
    const atMax = this.max !== undefined && this.value >= this.max;

    return (
      <Host class='scarlet-number-input-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-number-input__label',
          requiredClass: 'scarlet-number-input__required'
        })}
        <div
          class={{
            'scarlet-number-input__field': true,
            [`scarlet-number-input__field--${this.size}`]: true,
            'scarlet-number-input__field--invalid': isInvalid
          }}
        >
          <button
            type='button'
            class='scarlet-number-input__button'
            disabled={this.disabled || atMin}
            aria-label='Diminuir'
            onClick={this.handleDecrement}
          >
            <scarlet-icon name='minus' size='0.9em' />
          </button>
          <input
            ref={el => (this.inputEl = el)}
            id={this.inputId}
            class={{
              'scarlet-number-input__input': true,
              'scarlet-number-input__input--invalid': isInvalid
            }}
            type='text'
            inputMode='numeric'
            name={this.name}
            value={String(this.value)}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={describedBy}
            onInput={this.handleInput}
            onBlur={this.handleBlur}
          />
          <button
            type='button'
            class='scarlet-number-input__button'
            disabled={this.disabled || atMax}
            aria-label='Aumentar'
            onClick={this.handleIncrement}
          >
            <scarlet-icon name='plus' size='0.9em' />
          </button>
        </div>
        {renderFieldMessage({
          errorMessage: this.errorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-number-input__message scarlet-number-input__message--error',
          helperClass: 'scarlet-number-input__message scarlet-number-input__message--helper'
        })}
      </Host>
    );
  }
}
