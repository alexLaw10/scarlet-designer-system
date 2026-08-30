# scarlet-input-currency



<!-- Auto Generated Below -->


## Overview

A monetary input that formats digits as currency growing from the right
(like a card machine) — typing "1234" produces "R$ 12,34". Unlike the
other masked inputs, `scarletInput`/`scarletChange` emit the plain
**numeric** amount (e.g. `12.34`), not the formatted string — that's
almost always what you actually want from a money field. Read the
formatted text itself via `value`.

## Properties

| Property         | Attribute         | Description                                                               | Type                                   | Default     |
| ---------------- | ----------------- | ------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `currencySymbol` | `currency-symbol` | Currency symbol shown before the amount.                                  | `"R$"`                                 | `'R$'`      |
| `disabled`       | `disabled`        | Disables the input.                                                       | `boolean`                              | `false`     |
| `errorMessage`   | `error-message`   | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                  | `undefined` |
| `helperText`     | `helper-text`     | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined` |
| `invalid`        | `invalid`         | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                              | `false`     |
| `label`          | `label`           | Visible label rendered above the input.                                   | `string \| undefined`                  | `undefined` |
| `name`           | `name`            | Name submitted with a parent form.                                        | `string \| undefined`                  | `undefined` |
| `placeholder`    | `placeholder`     | Placeholder text shown when the input is empty.                           | `"R$ 0,00"`                            | `'R$ 0,00'` |
| `required`       | `required`        | Marks the input as required in a parent form.                             | `boolean`                              | `false`     |
| `size`           | `size`            | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`      |
| `value`          | `value`           | Current formatted value, e.g. `R$ 1.234,56`.                              | `string`                               | `''`        |


## Events

| Event           | Description                                                                                      | Type                      |
| --------------- | ------------------------------------------------------------------------------------------------ | ------------------------- |
| `scarletBlur`   | Emitted when the input loses focus.                                                              | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the input loses focus after its value has changed, with the current numeric amount. | `CustomEvent<number>`     |
| `scarletFocus`  | Emitted when the input gains focus.                                                              | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current numeric amount (e.g. `12.34`).                       | `CustomEvent<number>`     |


## Methods

### `getNumericValue() => Promise<number>`

The current amount as a plain number (same value `scarletInput`/`scarletChange` emit).

#### Returns

Type: `Promise<number>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
