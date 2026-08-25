import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '../../types';
import { generateId } from '../../utils';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '../../utils/form-field';

export type ScarletTextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

/**
 * A multi-line labeled text input with helper/error text and built-in accessibility wiring.
 */
@Component({
  tag: 'scarlet-textarea',
  styleUrl: 'scarlet-textarea.scss',
  shadow: true,
})
export class ScarletTextarea {
  private textareaEl?: HTMLTextAreaElement;
  private readonly textareaId = generateId('scarlet-textarea');
  private readonly helperId = generateId('scarlet-textarea-helper');
  private readonly errorId = generateId('scarlet-textarea-error');

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current value of the textarea. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the textarea is empty. */
  @Prop() readonly placeholder?: string;

  /** Visible label rendered above the textarea. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the textarea. Hidden while `errorMessage` is set. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the textarea. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the textarea as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the textarea. */
  @Prop() readonly disabled = false;

  /** Makes the textarea read-only. */
  @Prop() readonly readonly = false;

  /** Marks the textarea as required in a parent form. */
  @Prop() readonly required = false;

  /** Number of visible text rows. */
  @Prop() readonly rows = 4;

  /** Maximum number of characters allowed. */
  @Prop() readonly maxlength?: number;

  /** Controls whether/how the user can resize the textarea. */
  @Prop() readonly resize: ScarletTextareaResize = 'vertical';

  /** Size of the textarea (affects padding and font size). */
  @Prop() readonly size: Size = 'md';

  /** Emitted on every keystroke with the current value. */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted when the textarea loses focus after its value has changed. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the textarea gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the textarea loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Focuses the internal textarea element. */
  @Method()
  async setFocus(): Promise<void> {
    this.textareaEl?.focus();
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLTextAreaElement;
    this.value = target.value;
    this.scarletInput.emit(this.value);
  };

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLTextAreaElement;
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
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });

    return (
      <Host class="scarlet-textarea-host">
        {renderFieldLabel({
          htmlFor: this.textareaId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-textarea__label',
          requiredClass: 'scarlet-textarea__required',
        })}
        <textarea
          ref={(el) => (this.textareaEl = el)}
          id={this.textareaId}
          class={{
            'scarlet-textarea': true,
            [`scarlet-textarea--${this.size}`]: true,
            [`scarlet-textarea--resize-${this.resize}`]: true,
            'scarlet-textarea--invalid': isInvalid,
          }}
          name={this.name}
          rows={this.rows}
          maxlength={this.maxlength}
          placeholder={this.placeholder}
          value={this.value}
          disabled={this.disabled}
          readOnly={this.readonly}
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
          errorClass: 'scarlet-textarea__message scarlet-textarea__message--error',
          helperClass: 'scarlet-textarea__message scarlet-textarea__message--helper',
        })}
      </Host>
    );
  }
}
