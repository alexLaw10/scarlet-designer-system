// Scarlet Design System - Calendar utilities (pt-BR)
//
// Pure date-grid math for scarlet-date-picker: parsing/formatting the same
// DD/MM/AAAA value scarlet-input-date uses, plus building the 6-week grid a
// calendar view renders. Kept separate from validators.ts/masks.ts — those
// are text-mask/checksum concerns shared by every pt-BR input, these are
// grid/navigation concerns specific to the calendar popover.
import { onlyDigits } from './masks';
import { isValidDateBR } from './validators';

export const WEEKDAY_LABELS_PT_BR = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const MONTH_LABELS_PT_BR = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

/** Parses a complete, real `DD/MM/AAAA` value into a `Date` — `undefined` for anything incomplete or invalid. */
export function parseDateBR(rawValue: string | undefined): Date | undefined {
  if (!rawValue || !isValidDateBR(rawValue)) return undefined;
  const digits = onlyDigits(rawValue);
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  return new Date(year, month - 1, day);
}

/** Formats a `Date` as `DD/MM/AAAA`. */
export function formatDateBR(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).padStart(4, '0');
  return `${day}/${month}/${year}`;
}

/** Same calendar day, ignoring time — also `false` when either side is missing. */
export function isSameDate(a: Date | undefined, b: Date | undefined): boolean {
  return Boolean(a) && Boolean(b) && a!.getFullYear() === b!.getFullYear() && a!.getMonth() === b!.getMonth() && a!.getDate() === b!.getDate();
}

/** Whether `date` falls within `[min, max]` (inclusive), ignoring time. Either bound may be omitted. */
export function isDateInRange(date: Date, min: Date | undefined, max: Date | undefined): boolean {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  if (min && day < new Date(min.getFullYear(), min.getMonth(), min.getDate()).getTime()) return false;
  if (max && day > new Date(max.getFullYear(), max.getMonth(), max.getDate()).getTime()) return false;
  return true;
}

/** Number of calendar days in `month` (0-indexed, matching `Date`) of `year`. */
export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

/** Adds `amount` months, clamping the day-of-month so e.g. 31 Jan + 1 month lands on 28/29 Feb instead of rolling into March. */
export function addMonths(date: Date, amount: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  target.setDate(Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
  return target;
}

export function startOfWeek(date: Date): Date {
  return addDays(date, -date.getDay());
}

export function endOfWeek(date: Date): Date {
  return addDays(date, 6 - date.getDay());
}

export interface CalendarDay {
  date: Date;
  inCurrentMonth: boolean;
}

/**
 * A fixed 6-week (42-day), Sunday-first grid for `year`/`month` (0-indexed,
 * matching `Date`), padded with the trailing days of the previous month and
 * the leading days of the next so every row stays full and every month
 * renders at the same height.
 */
export function getMonthGrid(year: number, month: number): CalendarDay[][] {
  const startOffset = new Date(year, month, 1).getDay(); // 0 (Sun) - 6 (Sat)
  const gridStart = new Date(year, month, 1 - startOffset);

  const days: CalendarDay[] = [];
  for (let i = 0; i < 42; i++) {
    const date = addDays(gridStart, i);
    days.push({ date, inCurrentMonth: date.getMonth() === month });
  }

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < 42; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}
