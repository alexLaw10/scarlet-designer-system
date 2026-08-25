// Scarlet Design System - Input Validators (pt-BR)
import { onlyDigits } from './masks';

function calcCheckDigit(digits: number[], weights: number[]): number {
  const sum = digits.reduce((acc, digit, i) => acc + digit * weights[i], 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

/** Validates a CPF's two check digits — not just that it has 11 digits. */
export function isValidCPF(rawValue: string): boolean {
  const digits = onlyDigits(rawValue);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const nums = digits.split('').map(Number);
  const d1 = calcCheckDigit(nums.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcCheckDigit([...nums.slice(0, 9), d1], [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

  return d1 === nums[9] && d2 === nums[10];
}

/** Validates a CNPJ's two check digits — not just that it has 14 digits. */
export function isValidCNPJ(rawValue: string): boolean {
  const digits = onlyDigits(rawValue);
  if (digits.length !== 14 || /^(\d)\1{13}$/.test(digits)) return false;

  const nums = digits.split('').map(Number);
  const d1 = calcCheckDigit(nums.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calcCheckDigit([...nums.slice(0, 12), d1], [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

  return d1 === nums[12] && d2 === nums[13];
}

/** CPF (11 digits) or CNPJ (14 digits), whichever length matches. */
export function isValidDocument(rawValue: string): boolean {
  const digits = onlyDigits(rawValue);
  if (digits.length === 11) return isValidCPF(digits);
  if (digits.length === 14) return isValidCNPJ(digits);
  return false;
}

/** Which document type a partially/fully typed value looks like, by digit count. */
export function documentType(rawValue: string): 'cpf' | 'cnpj' | undefined {
  const length = onlyDigits(rawValue).length;
  if (length === 0) return undefined;
  return length > 11 ? 'cnpj' : 'cpf';
}

/** Real calendar validity (leap years, days-per-month) for a `DD/MM/AAAA` value, not just 8 digits. */
export function isValidDateBR(rawValue: string): boolean {
  const digits = onlyDigits(rawValue);
  if (digits.length !== 8) return false;

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (month < 1 || month > 12 || year < 1) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day >= 1 && day <= daysInMonth;
}

/** The standard Luhn checksum used by every major card network. */
export function isValidCreditCardLuhn(rawValue: string): boolean {
  const digits = onlyDigits(rawValue);
  if (digits.length < 12) return false;

  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = Number(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export type CreditCardBrand = 'visa' | 'mastercard' | 'amex' | 'diners' | 'discover' | 'elo' | 'hipercard';

/** Detects the card network from its IIN/BIN prefix. Returns `undefined` until enough digits are typed. */
export function detectCardBrand(rawValue: string): CreditCardBrand | undefined {
  const digits = onlyDigits(rawValue);
  if (/^4/.test(digits)) return 'visa';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^3(0[0-5]|[68])/.test(digits)) return 'diners';
  if (/^6(?:011|5)/.test(digits)) return 'discover';
  if (/^(4011|4312|4389|4514|4573|6277|6363|650[0-5]|6516|6550)/.test(digits)) return 'elo';
  if (/^(606282|3841)/.test(digits)) return 'hipercard';
  return undefined;
}
