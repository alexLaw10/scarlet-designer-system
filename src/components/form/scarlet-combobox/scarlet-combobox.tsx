import { Component, Prop, State, Watch, Event, type EventEmitter, h, Host, Listen, Element, Method } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

export interface ScarletComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * A searchable select — type to filter a list of options, following the
 * WAI-ARIA 1.2 "editable combobox with list autocomplete" pattern. Unlike
 * `scarlet-menu`/`scarlet-date-picker`'s popovers, DOM focus never leaves
 * the text input while the list is open: the highlighted option is tracked
 * with `aria-activedescendant` instead of moving real focus button-to-
 * button, so the user can keep typing without ever losing their place.
 *
 * Known limitation: like `scarlet-tooltip`/`scarlet-date-picker`/
 * `scarlet-menu`, positioning is plain CSS anchored to the field — it
 * doesn't flip or reposition to stay in the viewport.
 */
@Component({
  tag: 'scarlet-combobox',
  styleUrl: 'scarlet-combobox.scss',
  shadow: true,
})
export class ScarletCombobox {
  private inputEl?: HTMLInputElement;

  private readonly inputId = generateId('scarlet-combobox');
  private readonly listId = generateId('scarlet-combobox-list');
  private readonly helperId = generateId('scarlet-combobox-helper');
  private readonly errorId = generateId('scarlet-combobox-error');

  @Element() el!: HTMLElement;

  /** The options to search through. */
  @Prop() readonly options: ScarletComboboxOption[] = [];

  /** Value of the currently selected option. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when nothing is typed. */
  @Prop() readonly placeholder?: string;

  /** Visible label rendered above the field. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the field. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the field. Implies the invalid state. */
  @Prop() readonly errorMessage?: string;

  /** Marks the field as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the field. */
  @Prop() readonly disabled = false;

  /** Marks the field as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the field. */
  @Prop() readonly size: Size = 'md';

  /** Message shown in the list when no option matches the current query. */
  @Prop() readonly noResultsMessage = 'Nenhum resultado encontrado.';

  @State() private open = false;
  /** The text currently in the input — starts as the selected option's label, diverges once the user types. */
  @State() private query = '';
  @State() private focusedValue?: string;

  /** Emitted on every keystroke with the current query text (not the selected value). */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted with the newly selected option's value when an option is picked. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the field gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the field loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  componentWillLoad(): void {
    this.query = this.selectedLabel();
  }

  @Watch('value')
  handleValueChange(): void {
    this.query = this.selectedLabel();
  }

  // `options` is a JS-property-only prop (an array can't come from an HTML
  // attribute), so in every framework it's common for it to arrive *after*
  // initial render — e.g. loaded asynchronously, or just set as a property
  // a tick after the element is created. Without this, `value` could
  // already be set while `options` is still empty, computing `query` as ''
  // instead of the real label once the options do arrive. Skipped while
  // `open`, so a mid-typing options update (e.g. new array reference, same
  // content, from a parent re-render) never clobbers what the user's typing.
  @Watch('options')
  handleOptionsChange(): void {
    if (!this.open) {
      this.query = this.selectedLabel();
    }
  }

  @Listen('keydown')
  handleHostKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.closeList(true);
    }
  }

  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!event.composedPath().includes(this.el)) {
      this.closeList(true);
    }
  }

  /** Focuses the internal text input. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  private selectedLabel(): string {
    return this.options.find((option) => option.value === this.value)?.label ?? '';
  }

  private get filteredOptions(): ScarletComboboxOption[] {
    const query = this.query.trim().toLowerCase();
    // Opening the list without having typed anything (a plain click/focus,
    // or ArrowDown) leaves `query` exactly equal to the selected option's
    // own label — filtering against that would only ever show that one
    // option. Treat that case as "not filtering yet" and show everything.
    if (!query || query === this.selectedLabel().toLowerCase()) {
      return this.options;
    }
    return this.options.filter((option) => option.label.toLowerCase().includes(query));
  }

  private openList(): void {
    if (this.open) return;
    this.open = true;
    const enabledOptions = this.filteredOptions.filter((option) => !option.disabled);
    const currentlySelected = enabledOptions.find((option) => option.value === this.value);
    this.focusedValue = (currentlySelected ?? enabledOptions[0])?.value;
  }

  private closeList(revertQuery: boolean): void {
    if (!this.open) return;
    this.open = false;
    this.focusedValue = undefined;
    if (revertQuery) {
      this.query = this.selectedLabel();
    }
  }

  private selectOption(option: ScarletComboboxOption): void {
    if (option.disabled) return;
    this.value = option.value;
    this.query = option.label;
    this.scarletChange.emit(this.value);
    this.closeList(false);
  }

  private handleInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.query = target.value;
    if (!this.open) this.open = true;
    const enabledOptions = this.filteredOptions.filter((option) => !option.disabled);
    this.focusedValue = enabledOptions[0]?.value;
    this.scarletInput.emit(this.query);
  };

  private handleFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
    this.openList();
  };

  private handleBlur = (event: FocusEvent): void => {
    // A click on an option already committed the selection (mousedown fires
    // before blur, and the option's own onClick has already run by the time
    // this handler sees the resulting blur) — reverting here is only ever
    // reached for a real "user tabbed/clicked away without picking anything".
    this.closeList(true);
    this.scarletBlur.emit(event);
  };

  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' && !this.open) {
      event.preventDefault();
      this.openList();
      return;
    }

    if (!this.open) return;

    const enabledOptions = this.filteredOptions.filter((option) => !option.disabled);
    if (event.key === 'Enter') {
      event.preventDefault();
      const match = enabledOptions.find((option) => option.value === this.focusedValue);
      if (match) this.selectOption(match);
      return;
    }

    if (enabledOptions.length === 0) return;
    const currentIndex = enabledOptions.findIndex((option) => option.value === this.focusedValue);
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % enabledOptions.length;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex === -1 ? enabledOptions.length - 1 : (currentIndex - 1 + enabledOptions.length) % enabledOptions.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledOptions.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    this.focusedValue = enabledOptions[nextIndex].value;
  };

  private optionId(value: string): string {
    return `${this.listId}-${value}`;
  }

  render() {
    const effectiveErrorMessage = this.errorMessage;
    const isInvalid = this.invalid || Boolean(effectiveErrorMessage);
    const describedBy = computeDescribedBy(effectiveErrorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });
    const options = this.filteredOptions;

    return (
      <Host class="scarlet-combobox-host">
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-combobox__label',
          requiredClass: 'scarlet-combobox__required',
        })}
        <div class="scarlet-combobox__field">
          <input
            ref={(el) => (this.inputEl = el)}
            id={this.inputId}
            class={{
              'scarlet-combobox__input': true,
              [`scarlet-combobox__input--${this.size}`]: true,
              'scarlet-combobox__input--invalid': isInvalid,
            }}
            type="text"
            role="combobox"
            aria-expanded={this.open ? 'true' : 'false'}
            aria-controls={this.listId}
            aria-autocomplete="list"
            aria-activedescendant={this.open && this.focusedValue ? this.optionId(this.focusedValue) : undefined}
            value={this.query}
            placeholder={this.placeholder}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={describedBy}
            onInput={this.handleInput}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onKeyDown={this.handleKeyDown}
          />
          {this.open ? (
            <ul class="scarlet-combobox__list" id={this.listId} role="listbox">
              {options.length === 0 ? (
                <li class="scarlet-combobox__empty">{this.noResultsMessage}</li>
              ) : (
                options.map((option) => (
                  <li
                    id={this.optionId(option.value)}
                    class={{
                      'scarlet-combobox__option': true,
                      'scarlet-combobox__option--focused': option.value === this.focusedValue,
                      'scarlet-combobox__option--selected': option.value === this.value,
                    }}
                    role="option"
                    aria-selected={option.value === this.value ? 'true' : 'false'}
                    aria-disabled={option.disabled ? 'true' : undefined}
                    // mousedown (not click) with preventDefault(): the
                    // browser's default mousedown behavior is what would
                    // move focus off the input in the first place, so
                    // preventing it here keeps the input focused throughout
                    // — the input never blurs, so handleBlur's "revert the
                    // query" path never runs for a real option pick.
                    onMouseDown={(event) => {
                      event.preventDefault();
                      this.selectOption(option);
                    }}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          ) : null}
        </div>
        {renderFieldMessage({
          errorMessage: effectiveErrorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-combobox__message scarlet-combobox__message--error',
          helperClass: 'scarlet-combobox__message scarlet-combobox__message--helper',
        })}
      </Host>
    );
  }
}
