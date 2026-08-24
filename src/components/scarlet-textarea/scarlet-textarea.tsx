import { Component, Prop, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '../../types';
import { generateId } from '../../utils';

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
    const describedBy =
      [this.errorMessage ? this.errorId : null, !this.errorMessage && this.helperText ? this.helperId : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
      <Host class="scarlet-textarea-host">
        {this.label ? (
          <label class="scarlet-textarea__label" htmlFor={this.textareaId}>
            {this.label}
            {this.required ? (
              <span class="scarlet-textarea__required" aria-hidden="true">
                {' '}
                *
              </span>
            ) : null}
          </label>
        ) : null}
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
        {this.errorMessage ? (
          <p class="scarlet-textarea__message scarlet-textarea__message--error" id={this.errorId} role="alert">
            {this.errorMessage}
          </p>
        ) : this.helperText ? (
          <p class="scarlet-textarea__message scarlet-textarea__message--helper" id={this.helperId}>
            {this.helperText}
          </p>
        ) : null}
      </Host>
    );
  }
}
