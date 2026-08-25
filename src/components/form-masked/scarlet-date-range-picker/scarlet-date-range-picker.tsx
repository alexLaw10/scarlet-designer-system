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
  addMonths,
  daysInMonth,
  getMonthGrid,
} from '@/utils/calendar';
import { computeDescribedBy, renderFieldLabel, renderFieldMessage } from '@/utils/form-field';

export interface ScarletDateRangeChange {
  start: string;
  end: string;
}

/**
 * Two `DD/MM/AAAA` fields (start/end) sharing one calendar popover for
 * picking both ends of a range — built the same way `scarlet-date-picker`
 * is (same masking/validation per field, same popover mechanics), doubled.
 * See that component's own doc comment for the shared known limitations
 * (no Tab-out auto-close, no viewport flip).
 *
 * Picking works the classic two-click way: the first day clicked becomes
 * the start (clearing any previous end); the second becomes the end and
 * closes the popover — unless it's *before* the start, in which case it
 * becomes the new start instead and the popover stays open for the end.
 */
@Component({
  tag: 'scarlet-date-range-picker',
  styleUrl: 'scarlet-date-range-picker.scss',
  shadow: true,
})
export class ScarletDateRangePicker {
  private startInputEl?: HTMLInputElement;
  private endInputEl?: HTMLInputElement;
  private toggleBtnEl?: HTMLButtonElement;
  private focusedCellEl?: HTMLButtonElement;
  private shouldFocusGrid = false;

  private readonly startInputId = generateId('scarlet-date-range-start');
  private readonly endInputId = generateId('scarlet-date-range-end');
  private readonly helperId = generateId('scarlet-date-range-helper');
  private readonly errorId = generateId('scarlet-date-range-error');
  private readonly titleId = generateId('scarlet-date-range-title');

  @Element() el!: HTMLElement;

  /** Start of the range, as `DD/MM/AAAA`. */
  @Prop({ mutable: true }) startValue = '';

  /** End of the range, as `DD/MM/AAAA`. */
  @Prop({ mutable: true }) endValue = '';

  /** Placeholder for the start field. */
  @Prop() readonly startPlaceholder = 'Data inicial';

  /** Placeholder for the end field. */
  @Prop() readonly endPlaceholder = 'Data final';

  /** Visible label rendered above both fields. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the fields. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the fields. */
  @Prop() readonly errorMessage?: string;

  /** Marks the fields as invalid, independent of `errorMessage`. */
  @Prop() readonly invalid = false;

  /** Disables both fields and the calendar toggle. */
  @Prop() readonly disabled = false;

  /** Marks the fields as required in a parent form. */
  @Prop() readonly required = false;

  /** Size of the fields. */
  @Prop() readonly size: Size = 'md';

  /** Earliest selectable date, as `DD/MM/AAAA`. */
  @Prop() readonly min?: string;

  /** Latest selectable date, as `DD/MM/AAAA`. */
  @Prop() readonly max?: string;

  @State() private open = false;
  @State() private viewYear = new Date().getFullYear();
  @State() private viewMonth = new Date().getMonth();
  @State() private focusedDate?: Date;
  /** True once a start is picked and the popover is waiting for the end. */
  @State() private pickingEnd = false;
  @State() private startAutoInvalid = false;
  @State() private endAutoInvalid = false;

  /** Emitted whenever either bound changes — a keystroke, a day pick, or a blur-triggered mask correction. */
  @Event() scarletChange!: EventEmitter<ScarletDateRangeChange>;

  /** Emitted after the popover opens. */
  @Event() scarletShow!: EventEmitter<void>;

  /** Emitted after the popover closes. */
  @Event() scarletHide!: EventEmitter<void>;

  /** Focuses the start field. */
  @Method()
  async setFocus(): Promise<void> {
    this.startInputEl?.focus();
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
    const start = parseDateBR(this.startValue);
    const base = start ?? this.focusedDate ?? new Date();
    this.viewYear = base.getFullYear();
    this.viewMonth = base.getMonth();
    this.focusedDate = base;
    this.pickingEnd = Boolean(start) && !parseDateBR(this.endValue);
    this.open = true;
    this.shouldFocusGrid = true;
    this.scarletShow.emit();
  }

  private closePanel(): void {
    if (!this.open) return;
    this.open = false;
    this.scarletHide.emit();
  }

  private emitChange(): void {
    this.scarletChange.emit({ start: this.startValue, end: this.endValue });
  }

  private handleToggleClick = (): void => {
    if (this.disabled) return;
    if (this.open) {
      this.closePanel();
    } else {
      this.openPanel();
    }
  };

  private handleFieldKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' && !this.open) {
      event.preventDefault();
      this.openPanel();
    }
  };

  private handleStartInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.startValue = maskDate(target.value);
    this.startAutoInvalid = false;
    this.emitChange();
  };

  private handleEndInput = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.endValue = maskDate(target.value);
    this.endAutoInvalid = false;
    this.emitChange();
  };

  private handleStartBlur = (): void => {
    const isComplete = onlyDigits(this.startValue).length === 8;
    this.startAutoInvalid = isComplete && !isValidDateBR(this.startValue);
  };

  private handleEndBlur = (): void => {
    const isComplete = onlyDigits(this.endValue).length === 8;
    this.endAutoInvalid = isComplete && !isValidDateBR(this.endValue);
  };

  private selectDate = (date: Date): void => {
    if (this.disabled) return;
    const { min, max } = this.getMinMax();
    if (!isDateInRange(date, min, max)) return;

    if (!this.pickingEnd) {
      this.startValue = formatDateBR(date);
      this.endValue = '';
      this.pickingEnd = true;
      this.emitChange();
      return;
    }

    const start = parseDateBR(this.startValue);
    if (start && date.getTime() < start.getTime()) {
      // Picked something before the start — restart the range from here.
      this.startValue = formatDateBR(date);
      this.endValue = '';
      this.emitChange();
      return;
    }

    this.endValue = formatDateBR(date);
    this.pickingEnd = false;
    this.emitChange();
    this.closePanel();
    this.endInputEl?.focus();
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

  private handleGridKeyDown = (event: KeyboardEvent): void => {
    const current = this.focusedDate ?? new Date(this.viewYear, this.viewMonth, 1);
    let next: Date | undefined;

    switch (event.key) {
      case 'ArrowRight':
        next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 1);
        break;
      case 'ArrowLeft':
        next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 1);
        break;
      case 'ArrowDown':
        next = new Date(current.getFullYear(), current.getMonth(), current.getDate() + 7);
        break;
      case 'ArrowUp':
        next = new Date(current.getFullYear(), current.getMonth(), current.getDate() - 7);
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
    const effectiveError =
      this.errorMessage ?? (this.startAutoInvalid || this.endAutoInvalid ? 'Data inválida.' : undefined);
    const isInvalid = this.invalid || Boolean(effectiveError);
    const describedBy = computeDescribedBy(effectiveError, this.helperText, { helperId: this.helperId, errorId: this.errorId });

    const { min: minDate, max: maxDate } = this.getMinMax();
    const start = parseDateBR(this.startValue);
    const end = parseDateBR(this.endValue);
    const today = new Date();
    const weeks = getMonthGrid(this.viewYear, this.viewMonth);
    const rangeEnd = end ?? this.focusedDate;

    return (
      <Host class="scarlet-date-range-picker-host">
        {renderFieldLabel({
          htmlFor: this.startInputId,
          label: this.label,
          required: this.required,
          labelClass: 'scarlet-date-range-picker__label',
          requiredClass: 'scarlet-date-range-picker__required',
        })}
        <div class="scarlet-date-range-picker__field">
          <input
            ref={(el) => (this.startInputEl = el)}
            id={this.startInputId}
            class={{
              'scarlet-date-range-picker__input': true,
              [`scarlet-date-range-picker__input--${this.size}`]: true,
              'scarlet-date-range-picker__input--invalid': isInvalid,
            }}
            type="text"
            inputMode="numeric"
            value={this.startValue}
            placeholder={this.startPlaceholder}
            disabled={this.disabled}
            required={this.required}
            aria-invalid={isInvalid ? 'true' : undefined}
            aria-describedby={describedBy}
            onInput={this.handleStartInput}
            onBlur={this.handleStartBlur}
            onKeyDown={this.handleFieldKeyDown}
          />
          <span class="scarlet-date-range-picker__separator" aria-hidden="true">
            –
          </span>
          <input
            ref={(el) => (this.endInputEl = el)}
            id={this.endInputId}
            class={{
              'scarlet-date-range-picker__input': true,
              [`scarlet-date-range-picker__input--${this.size}`]: true,
              'scarlet-date-range-picker__input--invalid': isInvalid,
            }}
            type="text"
            inputMode="numeric"
            value={this.endValue}
            placeholder={this.endPlaceholder}
            disabled={this.disabled}
            required={this.required}
            aria-describedby={describedBy}
            onInput={this.handleEndInput}
            onBlur={this.handleEndBlur}
            onKeyDown={this.handleFieldKeyDown}
          />
          <button
            type="button"
            ref={(el) => (this.toggleBtnEl = el)}
            class="scarlet-date-range-picker__toggle"
            aria-label={this.open ? 'Fechar calendário' : 'Abrir calendário'}
            aria-haspopup="dialog"
            aria-expanded={this.open ? 'true' : 'false'}
            disabled={this.disabled}
            onClick={this.handleToggleClick}
          >
            <scarlet-icon name="calendar" size="1.1em" />
          </button>
          {this.open ? (
            <div class="scarlet-date-range-picker__panel" role="dialog" aria-label="Escolher intervalo de datas">
              <div class="scarlet-date-range-picker__panel-header">
                <button type="button" class="scarlet-date-range-picker__nav" aria-label="Mês anterior" onClick={this.goToPrevMonth}>
                  <scarlet-icon name="chevron-left" size="1.1em" />
                </button>
                <span class="scarlet-date-range-picker__panel-title" id={this.titleId} aria-live="polite">
                  {MONTH_LABELS_PT_BR[this.viewMonth]} {this.viewYear}
                </span>
                <button type="button" class="scarlet-date-range-picker__nav" aria-label="Próximo mês" onClick={this.goToNextMonth}>
                  <scarlet-icon name="chevron-right" size="1.1em" />
                </button>
              </div>
              <p class="scarlet-date-range-picker__hint">{this.pickingEnd ? 'Escolha a data final' : 'Escolha a data inicial'}</p>
              <div class="scarlet-date-range-picker__grid" role="grid" aria-labelledby={this.titleId} onKeyDown={this.handleGridKeyDown}>
                <div class="scarlet-date-range-picker__weekdays" role="row">
                  {WEEKDAY_LABELS_PT_BR.map((weekday) => (
                    <span class="scarlet-date-range-picker__weekday" role="columnheader" aria-hidden="true">
                      {weekday}
                    </span>
                  ))}
                </div>
                {weeks.map((week) => (
                  <div class="scarlet-date-range-picker__week" role="row">
                    {week.map((day) => {
                      const dayDisabled = !isDateInRange(day.date, minDate, maxDate);
                      const isStart = isSameDate(day.date, start);
                      const isEnd = isSameDate(day.date, end);
                      const inRange = Boolean(start) && Boolean(rangeEnd) && isDateInRange(day.date, start, rangeEnd);
                      const isFocused = isSameDate(day.date, this.focusedDate);
                      const isToday = isSameDate(day.date, today);
                      return (
                        <div class="scarlet-date-range-picker__cell" role="gridcell">
                          <button
                            type="button"
                            class={{
                              'scarlet-date-range-picker__day': true,
                              'scarlet-date-range-picker__day--outside': !day.inCurrentMonth,
                              'scarlet-date-range-picker__day--today': isToday,
                              'scarlet-date-range-picker__day--in-range': inRange,
                              'scarlet-date-range-picker__day--bound': isStart || isEnd,
                            }}
                            tabIndex={isFocused ? 0 : -1}
                            aria-selected={isStart || isEnd ? 'true' : 'false'}
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
          errorMessage: effectiveError,
          helperText: this.helperText,
          ids: { helperId: this.helperId, errorId: this.errorId },
          errorClass: 'scarlet-date-range-picker__message scarlet-date-range-picker__message--error',
          helperClass: 'scarlet-date-range-picker__message scarlet-date-range-picker__message--helper',
        })}
      </Host>
    );
  }
}
