import { Component, Prop, State, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

export type ScarletInputAiStatus = 'idle' | 'loading' | 'suggested' | 'same' | 'error';

/**
 * A single-line text input with a "melhorar texto" button that hands the
 * current value off to an AI provider for a rewrite suggestion, then lets
 * the user apply or discard it — nothing replaces the value on its own.
 *
 * This component never calls any AI provider itself: embedding a provider
 * API key in a design system that ships to a browser bundle would leak it
 * to every consuming app's users. `improve` is a plain async function,
 * set as a JS property (like `scarlet-table`'s `formatCell`, not parseable
 * from an HTML attribute) — wire it to your own backend endpoint, which is
 * the one that actually holds the API key and calls the provider. Leaving
 * `improve` unset hides the button entirely; the input still works as a
 * plain field.
 *
 * Flow: click → `improve(value, aiContext)` → while pending, the button
 * shows a spinner and the input stays editable. If the promise resolves to
 * text identical to the current value, a brief "already good" note shows
 * instead of a suggestion. Otherwise the suggestion appears in a preview
 * with Aplicar/Descartar — Aplicar replaces `value` and emits
 * `scarletChange`/`scarletImprove`; Descartar just dismisses it. Editing
 * the field while a suggestion/note is showing dismisses it (it no longer
 * describes the current text). A response that arrives after the value
 * changed, or after a newer `improve` call started, is silently dropped —
 * it's for a version of the text that's no longer current.
 */
@Component({
  tag: 'scarlet-input-ai',
  styleUrl: 'scarlet-input-ai.scss',
  shadow: true
})
export class ScarletInputAi {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-input-ai');
  private readonly helperId = generateId('scarlet-input-ai-helper');
  private readonly errorId = generateId('scarlet-input-ai-error');
  private resetTimeoutId?: ReturnType<typeof setTimeout>;
  /** Bumped on every improve() call so a stale response (an older call resolving after a newer one started) can tell it's no longer current. */
  private requestId = 0;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current value of the field. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the field is empty. */
  @Prop() readonly placeholder?: string;

  /** Visible label rendered above the field. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the field. Hidden while `errorMessage` is set. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the field. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the field as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the field and the improve button. */
  @Prop() readonly disabled = false;

  /** Makes the field read-only (the improve button stays usable — rewriting isn't editing the field directly until Aplicar). */
  @Prop() readonly readonly = false;

  /** Marks the field as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the field. */
  @Prop() readonly size: Size = 'md';

  /** Maximum number of characters allowed. */
  @Prop() readonly maxlength?: number;

  /**
   * Called with the current value (and `aiContext`, if set) when the
   * improve button is clicked. Must resolve with the suggested replacement
   * text. Set as a JS property — see the class doc comment for why this
   * can't call an AI provider directly. Omitting it hides the button.
   */
  @Prop() readonly improve?: (value: string, context?: string) => Promise<string>;

  /** Passed as `improve`'s second argument, alongside the current value — whatever the rewrite needs to know about where this text is used. */
  @Prop() readonly aiContext?: string;

  /** Accessible label for the improve button. */
  @Prop() readonly improveLabel = 'Melhorar texto';

  /** Shown briefly when the suggestion comes back identical to the current value. */
  @Prop() readonly sameLabel = 'Já está bom 👍';

  /** Shown briefly when `improve` rejects. */
  @Prop() readonly improveErrorLabel = 'Não foi possível melhorar o texto.';

  /** Label for the button that replaces the value with the suggestion. */
  @Prop() readonly applyLabel = 'Aplicar';

  /** Label for the button that dismisses the suggestion, keeping the current value. */
  @Prop() readonly discardLabel = 'Descartar';

  /** How long the "already good"/error note stays before reverting to idle, in milliseconds. */
  @Prop() readonly resetAfter = 4000;

  @State() private status: ScarletInputAiStatus = 'idle';
  @State() private suggestion = '';

  /** Emitted on every keystroke with the current value. */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted when the field loses focus after its value has changed, and right after a suggestion is applied. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the field gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the field loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Emitted with the new value right after a suggestion is applied (alongside `scarletChange`) — listen here specifically to react to an AI-driven edit. */
  @Event() scarletImprove!: EventEmitter<string>;

  /** Emitted with the error thrown/rejected by `improve`. */
  @Event() scarletImproveError!: EventEmitter<Error>;

  disconnectedCallback(): void {
    this.clearResetTimeout();
  }

  /** Focuses the internal input element. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  private clearResetTimeout(): void {
    if (this.resetTimeoutId !== undefined) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = undefined;
    }
  }

  private scheduleReset(): void {
    this.clearResetTimeout();
    this.resetTimeoutId = setTimeout(() => {
      this.status = 'idle';
    }, this.resetAfter);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    if (this.status !== 'loading' && this.status !== 'idle') {
      this.clearResetTimeout();
      this.status = 'idle';
      this.suggestion = '';
    }
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

  private handleImproveClick = async (): Promise<void> => {
    if (!this.improve || this.disabled || this.status === 'loading' || !this.value.trim()) return;

    this.clearResetTimeout();
    this.status = 'loading';
    const requestId = ++this.requestId;
    const valueAtRequestTime = this.value;

    try {
      const result = await this.improve(valueAtRequestTime, this.aiContext);
      if (requestId !== this.requestId || this.value !== valueAtRequestTime) return;

      if (result.trim() === valueAtRequestTime.trim()) {
        this.status = 'same';
        this.scheduleReset();
      } else {
        this.suggestion = result;
        this.status = 'suggested';
      }
    } catch (error) {
      if (requestId !== this.requestId || this.value !== valueAtRequestTime) return;
      this.status = 'error';
      this.scarletImproveError.emit(error as Error);
      this.scheduleReset();
    }
  };

  private handleApply = (): void => {
    this.value = this.suggestion;
    this.suggestion = '';
    this.status = 'idle';
    this.scarletChange.emit(this.value);
    this.scarletImprove.emit(this.value);
  };

  private handleDiscard = (): void => {
    this.status = 'idle';
    this.suggestion = '';
  };

  render() {
    const isInvalid = this.invalid || Boolean(this.errorMessage);
    const describedBy = computeDescribedBy(this.errorMessage, this.helperText, {
      helperId: this.helperId,
      errorId: this.errorId
    });
    const isLoading = this.status === 'loading';
    const canImprove = Boolean(this.improve) && !this.disabled && !isLoading && Boolean(this.value.trim());
    const showNote = this.status === 'same' || this.status === 'error';

    return (
      <Host class='scarlet-input-ai-host'>
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-input-ai__label',
          requiredClass: 'scarlet-input-ai__required'
        })}
        <div class='scarlet-input-ai__wrapper'>
          <input
            ref={el => (this.inputEl = el)}
            id={this.inputId}
            class={{
              'scarlet-input-ai': true,
              [`scarlet-input-ai--${this.size}`]: true,
              'scarlet-input-ai--invalid': isInvalid,
              'scarlet-input-ai--with-button': Boolean(this.improve)
            }}
            type='text'
            name={this.name}
            value={this.value}
            maxlength={this.maxlength}
            placeholder={this.placeholder}
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
          {this.improve ? (
            <button
              type='button'
              class={{
                'scarlet-input-ai__improve': true,
                'scarlet-input-ai__improve--loading': isLoading
              }}
              disabled={!canImprove}
              aria-label={this.improveLabel}
              onClick={this.handleImproveClick}
            >
              {isLoading ? (
                <scarlet-spinner size='xs' label={this.improveLabel} />
              ) : (
                <scarlet-icon name='pencil' size='0.9em' />
              )}
            </button>
          ) : null}
          <span
            class={{
              'scarlet-input-ai__note': true,
              'scarlet-input-ai__note--visible': showNote,
              'scarlet-input-ai__note--error': this.status === 'error'
            }}
            role='status'
            aria-live='polite'
          >
            {this.status === 'error' ? this.improveErrorLabel : this.sameLabel}
          </span>
        </div>
        {this.status === 'suggested' ? (
          <div class='scarlet-input-ai__preview' role='group' aria-label={this.improveLabel}>
            <p class='scarlet-input-ai__suggestion'>{this.suggestion}</p>
            <div class='scarlet-input-ai__actions'>
              <button
                type='button'
                class='scarlet-input-ai__discard'
                onClick={this.handleDiscard}
              >
                {this.discardLabel}
              </button>
              <button type='button' class='scarlet-input-ai__apply' onClick={this.handleApply}>
                {this.applyLabel}
              </button>
            </div>
          </div>
        ) : null}
        {renderFieldMessage({
          errorMessage: this.errorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-input-ai__message scarlet-input-ai__message--error',
          helperClass: 'scarlet-input-ai__message scarlet-input-ai__message--helper'
        })}
      </Host>
    );
  }
}
