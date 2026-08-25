import { Component, Prop, State, Event, type EventEmitter, h, Host, Method, Listen, Element } from '@stencil/core';
import type { Size } from '@/types';
import { generateId } from '@/utils';
import { maskDate, onlyDigits } from '@/utils/masks';
import { isValidDateBR } from '@/utils/validators';
import {
  WEEKDAY_LABELS_PT_BR,
  MONTH_LABELS_PT_BR,
  parseDateBR,
  formatDateBR,
  isSameDate,
  isDateInRange,
  addDays,
  addMonths,
  startOfWeek,
  endOfWeek,
  daysInMonth,
  getMonthGrid,
} from '@/utils/calendar';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

/**
 * A `DD/MM/AAAA` date input (typing, masking and calendar validation shared
 * with `scarlet-input-date`) plus a calendar popover for picking a date
 * visually — a button next to the field opens a month grid; arrow keys move
 * within it (Home/End jump to the start/end of the week, PageUp/PageDown
 * change month, Shift+PageUp/PageDown change year), Enter/Space picks the
 * focused day, Escape closes and returns focus to the toggle button.
 *
 * Known limitation: the popover closes on Escape, on picking a day, or on
 * clicking outside it — not on Tab-ing past its last focusable element. A
 * keyboard user who tabs out instead of pressing Escape will move focus
 * past the component with the panel still visually open.
 */
@Component({
  tag: 'scarlet-date-picker',
  styleUrl: 'scarlet-date-picker.scss',
  shadow: true,
})
export class ScarletDatePicker {
  private inputEl?: HTMLInputElement;
  private toggleBtnEl?: HTMLButtonElement;
  private focusedCellEl?: HTMLButtonElement;
  /** Set right before a render that should move real DOM focus into the grid, e.g. after opening or an arrow-key move. Consumed in `componentDidRender`. */
  private shouldFocusGrid = false;

  private readonly inputId = generateId('scarlet-date-picker');
  private readonly helperId = generateId('scarlet-date-picker-helper');
  private readonly errorId = generateId('scarlet-date-picker-error');
  private readonly panelId = generateId('scarlet-date-picker-panel');
  private readonly titleId = generateId('scarlet-date-picker-title');

  @Element() el!: HTMLElement;

  /** Whether the calendar popover is open. */
  @State() private open = false;

  /** Year of the month currently displayed in the popover. */
  @State() private viewYear = new Date().getFullYear();

  /** Month (0-indexed) currently displayed in the popover. */
  @State() private viewMonth = new Date().getMonth();

  /** The day currently holding the grid's roving tab stop — not necessarily the selected value. */
  @State() private focusedDate?: Date;

  /** Set once a complete value fails calendar validation on blur; cleared as soon as the user edits again. */
  @State() private autoInvalid = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Current formatted value, e.g. `31/12/2026`. */
  @Prop({ mutable: true }) value = '';

  /** Placeholder text shown when the input is empty. */
  @Prop() readonly placeholder = 'DD/MM/AAAA';

  /** Visible label rendered above the field. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the field. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the field. Takes priority over automatic calendar validation errors. */
  @Prop() readonly errorMessage?: string;

  /** Marks the field as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables the field and the calendar toggle. */
  @Prop() readonly disabled = false;

  /** Marks the field as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the field. */
  @Prop() readonly size: Size = 'md';

  /**
   * Validates the value is a real calendar date on blur once it's complete
   * (8 digits), showing a default "Data inválida" message when it isn't —
   * unless `errorMessage` is already set, which always wins.
   */
  @Prop() readonly validate = true;

  /** Earliest selectable date, as `DD/MM/AAAA`. Days before it render disabled in the calendar (typing them is still possible; `validate` doesn't enforce range). */
  @Prop() readonly min?: string;

  /** Latest selectable date, as `DD/MM/AAAA`. Days after it render disabled in the calendar. */
  @Prop() readonly max?: string;

  /** Emitted on every keystroke, and when a day is picked from the calendar, with the current formatted value. */
  @Event() scarletInput!: EventEmitter<string>;

  /** Emitted when the field loses focus after its value has changed, and when a day is picked from the calendar. */
  @Event() scarletChange!: EventEmitter<string>;

  /** Emitted when the text field gains focus. */
  @Event() scarletFocus!: EventEmitter<FocusEvent>;

  /** Emitted when the text field loses focus. */
  @Event() scarletBlur!: EventEmitter<FocusEvent>;

  /** Emitted after a `validate`-triggered check, with the resulting validity. */
  @Event() scarletValidityChange!: EventEmitter<boolean>;

  /** Emitted after the calendar popover opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /** Emitted after the calendar popover closes. */
  @Event() scarletHide!: EventEmitter<void>;

  /** Focuses the internal text input. */
  @Method()
  async setFocus(): Promise<void> {
    this.inputEl?.focus();
  }

  /** Whether the current value is a complete, real calendar date. */
  @Method()
  async isValid(): Promise<boolean> {
    return isValidDateBR(this.value);
  }

  /** The value as a native `Date`, or `undefined` if it isn't a complete valid date. */
  @Method()
  async toDate(): Promise<Date | undefined> {
    return parseDateBR(this.value);
  }

  /** Opens the calendar popover. */
  @Method()
  async show(): Promise<void> {
    this.openPanel();
  }

  /** Closes the calendar popover. */
  @Method()
  async hide(): Promise<void> {
    this.closePanel();
  }

  @Listen('keydown')
  handleHostKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      this.closePanel();
      this.toggleBtnEl?.focus();
    }
  }

  // Closes the popover on any click outside the component's own host —
  // composedPath() (unlike event.target) survives shadow-DOM retargeting,
  // so this reliably tells outside clicks apart from a click on the toggle
  // button, the input, or a day cell, all of which live inside `this.el`.
  @Listen('click', { target: 'document' })
  handleDocumentClick(event: MouseEvent): void {
    if (!this.open) return;
    if (!event.composedPath().includes(this.el)) {
      this.closePanel();
    }
  }

  componentDidRender(): void {
    if (this.shouldFocusGrid && this.open) {
      this.focusedCellEl?.focus();
      this.shouldFocusGrid = false;
    }
  }

  private getMinMax(): { min?: Date; max?: Date } {
    return { min: parseDateBR(this.min), max: parseDateBR(this.max) };
  }

  private openPanel(): void {
    if (this.open) return;
    const base = parseDateBR(this.value) ?? this.focusedDate ?? new Date();
    this.viewYear = base.getFullYear();
    this.viewMonth = base.getMonth();
    this.focusedDate = base;
    this.open = true;
    this.shouldFocusGrid = true;
    this.scarletShow.emit();
  }

  private closePanel(): void {
    if (!this.open) return;
    this.open = false;
    this.scarletHide.emit();
  }

  private handleToggleClick = (): void => {
    if (this.disabled) return;
    if (this.open) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  };

  private handleInputKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' && !this.open) {
      event.preventDefault();
      this.openPanel();
    }
  };

  private handleTextInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.value = maskDate(target.value);
    this.autoInvalid = false;
    this.scarletInput.emit(this.value);

    if (this.open) {
      const parsed = parseDateBR(this.value);
      if (parsed) {
        this.viewYear = parsed.getFullYear();
        this.viewMonth = parsed.getMonth();
        this.focusedDate = parsed;
      }
    }
  };

  private handleTextChange = (): void => {
    this.scarletChange.emit(this.value);
  };

  private handleTextFocus = (event: FocusEvent): void => {
    this.scarletFocus.emit(event);
  };

  private handleTextBlur = (event: FocusEvent): void => {
    if (this.validate) {
      const isComplete = onlyDigits(this.value).length === 8;
      const valid = !isComplete || isValidDateBR(this.value);
      this.autoInvalid = !valid;
      this.scarletValidityChange.emit(valid);
    }
    this.scarletBlur.emit(event);
  };

  private selectDate = (date: Date): void => {
    if (this.disabled) return;
    const { min, max } = this.getMinMax();
    if (!isDateInRange(date, min, max)) return;

    this.value = formatDateBR(date);
    this.autoInvalid = false;
    this.scarletInput.emit(this.value);
    this.scarletChange.emit(this.value);
    if (this.validate) {
      this.scarletValidityChange.emit(true);
    }
    this.closePanel();
    this.inputEl?.focus();
  };

  private shiftView(monthDelta: number): void {
    const base = new Date(this.viewYear, this.viewMonth, 1);
    const next = addMonths(base, monthDelta);
    this.viewYear = next.getFullYear();
    this.viewMonth = next.getMonth();

    const currentDay = this.focusedDate?.getDate() ?? 1;
    this.focusedDate = new Date(next.getFullYear(), next.getMonth(), Math.min(currentDay, daysInMonth(next.getFullYear(), next.getMonth())));
  }

  private goToPrevMonth = (): void => this.shiftView(-1);
  private goToNextMonth = (): void => this.shiftView(1);

  // Arrow/Home/End/PageUp/PageDown navigation for the WAI-ARIA grid pattern.
  // Enter/Space are deliberately NOT handled here: each day is a real
  // <button>, so the browser already activates it (firing onClick) on
  // either key — handling them here too would call selectDate() twice.
  private handleGridKeyDown = (event: KeyboardEvent): void => {
    const current = this.focusedDate ?? new Date(this.viewYear, this.viewMonth, 1);
    let next: Date | undefined;

    switch (event.key) {
      case 'ArrowRight':
        next = addDays(current, 1);
        break;
      case 'ArrowLeft':
        next = addDays(current, -1);
        break;
      case 'ArrowDown':
        next = addDays(current, 7);
        break;
      case 'ArrowUp':
        next = addDays(current, -7);
        break;
      case 'Home':
        next = startOfWeek(current);
        break;
      case 'End':
        next = endOfWeek(current);
        break;
      case 'PageUp':
        next = addMonths(current, event.shiftKey ? -12 : -1);
        break;
      case 'PageDown':
        next = addMonths(current, event.shiftKey ? 12 : 1);
        break;
      default:
        return;
    }

    if (!next) return;
    event.preventDefault();
    this.focusedDate = next;
    if (next.getFullYear() !== this.viewYear || next.getMonth() !== this.viewMonth) {
      this.viewYear = next.getFullYear();
      this.viewMonth = next.getMonth();
    }
    this.shouldFocusGrid = true;
  };

  render() {
    const effectiveErrorMessage = this.errorMessage ?? (this.autoInvalid ? 'Data inválida.' : undefined);
    const isInvalid = this.invalid || Boolean(effectiveErrorMessage);
    const describedBy = computeDescribedBy(effectiveErrorMessage, this.helperText, { helperId: this.helperId, errorId: this.errorId });

    const { min: minDate, max: maxDate } = this.getMinMax();
    const selectedDate = parseDateBR(this.value);
    const today = new Date();
    const weeks = getMonthGrid(this.viewYear, this.viewMonth);

    return (
      <Host class="scarlet-date-picker-host">
        {renderFieldLabel({
          htmlFor: this.inputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-date-picker__label',
          requiredClass: 'scarlet-date-picker__required',
        })}
        <div class="scarlet-date-picker__field">
          <input
            ref={(el) => (this.inputEl = el)}
            id={this.inputId}
            class={{
              'scarlet-date-picker__input': true,
              [`scarlet-date-picker__input--${this.size}`]: true,
              'scarlet-date-picker__input--invalid': isInvalid,
            }}
            type="text"
            inputMode="numeric"
            role="combobox"
            aria-haspopup="dialog"
            aria-expanded={this.open ? 'true' : 'false'}
            aria-controls={this.open ? this.panelId : undefined}
            name={this.name}
            value={this.value}
            placeholder={this.placeholder}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={describedBy}
            onInput={this.handleTextInput}
            onChange={this.handleTextChange}
            onFocus={this.handleTextFocus}
            onBlur={this.handleTextBlur}
            onKeyDown={this.handleInputKeyDown}
          />
          <button
            type="button"
            ref={(el) => (this.toggleBtnEl = el)}
            class="scarlet-date-picker__toggle"
            aria-label={this.open ? 'Fechar calendário' : 'Abrir calendário'}
            aria-haspopup="dialog"
            aria-expanded={this.open ? 'true' : 'false'}
            disabled={this.disabled}
            onClick={this.handleToggleClick}
          >
            <scarlet-icon name="calendar" size="1.1em" />
          </button>
          {this.open ? (
            <div id={this.panelId} class="scarlet-date-picker__panel" role="dialog" aria-label="Escolher data">
              <div class="scarlet-date-picker__panel-header">
                <button type="button" class="scarlet-date-picker__nav" aria-label="Mês anterior" onClick={this.goToPrevMonth}>
                  <scarlet-icon name="chevron-left" size="1.1em" />
                </button>
                <span class="scarlet-date-picker__panel-title" id={this.titleId} aria-live="polite">
                  {MONTH_LABELS_PT_BR[this.viewMonth]} {this.viewYear}
                </span>
                <button type="button" class="scarlet-date-picker__nav" aria-label="Próximo mês" onClick={this.goToNextMonth}>
                  <scarlet-icon name="chevron-right" size="1.1em" />
                </button>
              </div>
              <div class="scarlet-date-picker__grid" role="grid" aria-labelledby={this.titleId} onKeyDown={this.handleGridKeyDown}>
                <div class="scarlet-date-picker__weekdays" role="row">
                  {WEEKDAY_LABELS_PT_BR.map((weekday) => (
                    <span class="scarlet-date-picker__weekday" role="columnheader" aria-hidden="true">
                      {weekday}
                    </span>
                  ))}
                </div>
                {weeks.map((week) => (
                  <div class="scarlet-date-picker__week" role="row">
                    {week.map((day) => {
                      const dayDisabled = !isDateInRange(day.date, minDate, maxDate);
                      const isSelected = isSameDate(day.date, selectedDate);
                      const isFocused = isSameDate(day.date, this.focusedDate);
                      const isToday = isSameDate(day.date, today);
                      return (
                        <div class="scarlet-date-picker__cell" role="gridcell">
                          <button
                            type="button"
                            class={{
                              'scarlet-date-picker__day': true,
                              'scarlet-date-picker__day--outside': !day.inCurrentMonth,
                              'scarlet-date-picker__day--selected': isSelected,
                              'scarlet-date-picker__day--today': isToday,
                            }}
                            tabIndex={isFocused ? 0 : -1}
                            aria-selected={isSelected ? 'true' : 'false'}
                            aria-current={isToday ? 'date' : undefined}
                            aria-disabled={dayDisabled ? 'true' : undefined}
                            ref={(el) => {
                              if (isFocused) this.focusedCellEl = el;
                            }}
                            onClick={() => this.selectDate(day.date)}
                          >
                            {day.date.getDate()}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        {renderFieldMessage({
          errorMessage: effectiveErrorMessage,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-date-picker__message scarlet-date-picker__message--error',
          helperClass: 'scarlet-date-picker__message scarlet-date-picker__message--helper',
        })}
      </Host>
    );
  }
}
