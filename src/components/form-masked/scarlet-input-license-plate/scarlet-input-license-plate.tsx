import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskLicensePlate, onlyAlphanumeric } from '@/utils/masks';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

export type ScarletLicensePlateFormat = 'old' | 'mercosul';

/**
 * A Brazilian vehicle plate input — formats as the old `ABC-1234` pattern
 * or the newer Mercosul `ABC1D23` pattern, detected automatically from
 * whether a letter or digit lands in the 5th character.
 */
@Component({
  tag: 'scarlet-input-license-plate',
  styleUrl: 'scarlet-input-license-plate.scss',
  shadow: true,
})
export class ScarletInputLicensePlate {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-license-plate');
  private readonly helperId = generateId('scarlet-input-license-plate-helper');
  private readonly errorId = generateId('scarlet-input-license-plate-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `ABC-1234` or `ABC1D23`. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = 'ABC-1234';

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

  /** The raw alphanumeric characters behind the formatted value (no dash). */
  @Method()
  async getRawValue(): Promise<string> {
    return onlyAlphanumeric(this.value).toUpperCase();
  }

  /** Whether the current value looks like a complete old-format or Mercosul plate. */
  @Method()
  async getFormat(): Promise<ScarletLicensePlateFormat | undefined> {
    const raw = onlyAlphanumeric(this.value);
    if (raw.length !== 7) return undefined;
    return /[a-zA-Z]/.test(raw[4]) ? 'mercosul' : 'old';
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskLicensePlate(target.value);
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
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });

    return (
      <Host class="scarlet-input-license-plate-host">
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-license-plate__label',
          requiredClass: 'scarlet-input-license-plate__required',
        })}
        <input
          ref={(el) => (this.inputEl = el)}
          id={this.inputId}
          class={{
            'scarlet-input-license-plate': true,
            [`scarlet-input-license-plate--${this.size}`]: true,
            'scarlet-input-license-plate--invalid': isInvalid,
          }}
          type="text"
          autoCapitalize="characters"
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
          errorClass: 'scarlet-input-license-plate__message scarlet-input-license-plate__message--error',
          helperClass: 'scarlet-input-license-plate__message scarlet-input-license-plate__message--helper',
        })}
      </Host>
    );
  }
}
