// Scarlet Design System - Input Masks (pt-BR)
//
// Every mask function takes the *raw* current input value (whatever the
// user has typed/pasted so far, digits and formatting mixed) and returns
// the formatted display string. They're pure and re-run on every
// keystroke — components pass the new value in, get the masked value out,
// and separately extract the raw digits via `onlyDigits`/`onlyDigitsAndLetters`
// for the value that actually gets validated/submitted.

/** Strips everything but digits. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** Strips everything but letters and digits (for alphanumeric masks like license plates). */
export function onlyAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '');
}

// The mask functions above always correct an invalid character right back
// out on the very next render (their result replaces the input's own
// `value`) — but that correction happens *after* the browser has already
// shown the typed character for one frame, a visible flash on a fast
// device/typist that reads as "letters are allowed here" even though they
// never actually stick. `onBeforeInput` runs before the browser inserts
// anything, so blocking there removes the flash entirely — for a genuinely
// *typed* character only (`inputType === 'insertText'`); paste,
// autofill, backspace, IME composition etc. all still go through
// untouched and get sorted out by the mask function as before, since
// filtering *those* the same way would be more likely to break them than
// to help (e.g. pasting a fully formatted "(11) 91234-5678" should still
// work, not get rejected outright for containing parentheses).

/** `onBeforeInput` handler for a digit-only field (CEP, phone, CPF/CNPJ, date, credit card): blocks a typed non-digit character before it's ever inserted. */
export function blockNonDigitTyping(event: InputEvent): void {
  if (event.inputType === 'insertText' && event.data != null && /\D/.test(event.data)) {
    event.preventDefault();
  }
}

/** `onBeforeInput` handler for an alphanumeric-only field (license plates): blocks a typed symbol/space before it's ever inserted. */
export function blockNonAlphanumericTyping(event: InputEvent): void {
  if (event.inputType === 'insertText' && event.data != null && /[^a-zA-Z0-9]/.test(event.data)) {
    event.preventDefault();
  }
}

/**
 * Groups digits with separators, e.g. groups=[3,3,3,2] separators=['.','.','-']
 * turns "12345678901" into "123.456.789-01". A separator is only appended
 * once the *next* group has at least one digit, so the string never ends
 * with a dangling separator while the user is still typing.
 */
export function applyDigitGroups(digits: string, groups: number[], separators: string[]): string {
  let result = '';
  let pos = 0;
  for (let i = 0; i < groups.length; i++) {
    if (pos >= digits.length) break;
    result += digits.slice(pos, pos + groups[i]);
    pos += groups[i];
    if (pos < digits.length && separators[i]) {
      result += separators[i];
    }
  }
  return result;
}

/** `(11) 91234-5678` (mobile, 11 digits) or `(11) 1234-5678` (landline, 10 digits). */
export function maskPhone(rawValue: string): string {
  const digits = onlyDigits(rawValue).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const splitAt = digits.length > 10 ? 5 : 4;
  const firstPart = rest.slice(0, splitAt);
  const secondPart = rest.slice(splitAt);

  return secondPart ? `(${ddd}) ${firstPart}-${secondPart}` : `(${ddd}) ${firstPart}`;
}

/** `123.456.789-01` */
export function maskCPF(rawValue: string): string {
  return applyDigitGroups(onlyDigits(rawValue).slice(0, 11), [3, 3, 3, 2], ['.', '.', '-']);
}

/** `12.345.678/0001-90` */
export function maskCNPJ(rawValue: string): string {
  return applyDigitGroups(onlyDigits(rawValue).slice(0, 14), [2, 3, 3, 4, 2], ['.', '.', '/', '-']);
}

/** CPF (≤11 digits) or CNPJ (12+ digits) — same field, mask switches as you type past 11 digits. */
export function maskDocument(rawValue: string): string {
  const digits = onlyDigits(rawValue);
  return digits.length > 11 ? maskCNPJ(rawValue) : maskCPF(rawValue);
}

/** `01310-100` */
export function maskCEP(rawValue: string): string {
  return applyDigitGroups(onlyDigits(rawValue).slice(0, 8), [5, 3], ['-']);
}

/** `31/12/2026` — purely positional; use `isValidDateBR` from validators.ts to check it's a real date. */
export function maskDate(rawValue: string): string {
  return applyDigitGroups(onlyDigits(rawValue).slice(0, 8), [2, 2, 4], ['/', '/']);
}

/** `HH:MM`, 24h. */
export function maskTime(rawValue: string): string {
  return applyDigitGroups(onlyDigits(rawValue).slice(0, 4), [2, 2], [':']);
}

/**
 * `1234 5678 9012 3456` (or the 4-6-5 grouping real Amex cards use). Pass
 * `detectCardBrand(digits)` from validators.ts if you want Amex's grouping
 * honored; defaults to plain groups of 4.
 */
export function maskCreditCard(rawValue: string, brand?: 'amex' | 'diners'): string {
  const digits = onlyDigits(rawValue).slice(
    0,
    brand === 'amex' ? 15 : brand === 'diners' ? 14 : 16
  );
  if (brand === 'amex') {
    return applyDigitGroups(digits, [4, 6, 5], [' ', ' ']);
  }
  if (brand === 'diners') {
    return applyDigitGroups(digits, [4, 6, 4], [' ', ' ']);
  }
  return applyDigitGroups(digits, [4, 4, 4, 4], [' ', ' ', ' ']);
}

/**
 * Brazilian vehicle plates: old format `ABC-1234` or Mercosul `ABC1D23`.
 * Auto-detects which pattern is being typed once the 5th character is a
 * digit (old format) vs a letter (Mercosul).
 */
export function maskLicensePlate(rawValue: string): string {
  const chars = onlyAlphanumeric(rawValue).toUpperCase().slice(0, 7);
  if (chars.length <= 3) return chars;

  const letters = chars.slice(0, 3);
  const rest = chars.slice(3);
  // Old format is LLL-DDDD; Mercosul is LLLDLDD (a letter in the 2nd spot
  // after the initial 3 letters). Until that character is typed, default to
  // the old format's dash — still the more common plate on the road.
  const isMercosul = rest.length >= 2 && /[A-Z]/.test(rest[1]);

  return isMercosul ? `${letters}${rest}` : `${letters}-${rest}`;
}

/**
 * Currency input: formats raw digits as BRL growing from the right, like a
 * card machine — typing "1234" produces "R$ 12,34", typing "1234567"
 * produces "R$ 12.345,67". Pass a different `currencySymbol` to reuse this
 * for another currency (decimal/thousands separators stay pt-BR style).
 */
export function maskCurrency(rawValue: string, currencySymbol = 'R$'): string {
  // Unlike every other mask here, a currency amount has no natural fixed
  // width to slice to — but leaving it fully unbounded would let a garbage
  // paste (or a stuck key) grow the value indefinitely. 15 digits is a
  // generous ceiling (up to R$ 9.999.999.999.999,99) well past any
  // realistic amount, and past where `Number()` parsing loses precision
  // anyway.
  const digits = onlyDigits(rawValue).slice(0, 15).replace(/^0+(?=\d)/, '');
  if (digits.length === 0) return '';

  const padded = digits.padStart(3, '0');
  const cents = padded.slice(-2);
  const whole = padded.slice(0, -2).replace(/^0+(?=\d)/, '') || '0';
  const wholeWithThousands = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `${currencySymbol} ${wholeWithThousands},${cents}`;
}

/** The plain numeric value behind a `maskCurrency` display string, e.g. "R$ 1.234,56" → 1234.56. */
export function parseCurrencyToNumber(maskedValue: string): number {
  const digits = onlyDigits(maskedValue);
  return digits ? Number(digits) / 100 : 0;
}

/**
 * Percentage input: formats raw digits as a decimal percentage growing from
 * the right (like currency), e.g. typing "1234" produces "12,34%".
 * `decimals` controls how many digits sit after the comma (default 2).
 */
export function maskPercentage(rawValue: string, decimals = 2): string {
  // Same reasoning as maskCurrency: no natural fixed width, but still
  // bounded so a garbage paste can't grow it forever. 9 digits covers up to
  // a 7-figure percentage, comfortably past any realistic use case.
  const digits = onlyDigits(rawValue).slice(0, 9).replace(/^0+(?=\d)/, '');
  if (digits.length === 0) return '';
  const padded = digits.padStart(decimals + 1, '0');
  const whole = padded.slice(0, padded.length - decimals).replace(/^0+(?=\d)/, '') || '0';
  const fraction = padded.slice(padded.length - decimals);
  return `${whole},${fraction}%`;
}

/** The plain numeric value (0–100 range typically) behind a `maskPercentage` display string. */
export function parsePercentageToNumber(maskedValue: string): number {
  const normalized = maskedValue.replace('%', '').replace(/\./g, '').replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isNaN(parsed) ? 0 : parsed;
}
