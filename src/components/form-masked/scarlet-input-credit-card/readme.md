# scarlet-input-credit-card



<!-- Auto Generated Below -->


## Overview

A credit card number input — formats in groups of 4 (or Amex's 4-6-5 /
Diners' 4-6-4 grouping once that brand is detected from the card's
BIN/IIN prefix), with a Luhn checksum validation on blur.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                               | Type                                   | Default                 |
| -------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------- |
| `disabled`     | `disabled`      | Disables the input.                                                                                                                                                                                       | `boolean`                              | `false`                 |
| `errorMessage` | `error-message` | Error message rendered below the input. Takes priority over automatic Luhn validation errors.                                                                                                             | `string \| undefined`                  | `undefined`             |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while an error is shown.                                                                                                                                     | `string \| undefined`                  | `undefined`             |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                                                                                                                                                | `boolean`                              | `false`                 |
| `label`        | `label`         | Visible label rendered above the input.                                                                                                                                                                   | `string \| undefined`                  | `undefined`             |
| `name`         | `name`          | Name submitted with a parent form.                                                                                                                                                                        | `string \| undefined`                  | `undefined`             |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                                                                                                                                                           | `"0000 0000 0000 0000"`                | `'0000 0000 0000 0000'` |
| `required`     | `required`      | Marks the input as required in a parent form.                                                                                                                                                             | `boolean`                              | `false`                 |
| `size`         | `size`          | Size of the input.                                                                                                                                                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`                  |
| `validate`     | `validate`      | Validates the number against the Luhn checksum on blur once it's complete, showing a default "Número de cartão inválido" message when it fails — unless `errorMessage` is already set, which always wins. | `boolean`                              | `true`                  |
| `value`        | `value`         | Current formatted value.                                                                                                                                                                                  | `string`                               | `''`                    |


## Events

| Event                   | Description                                                                  | Type                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `scarletBlur`           | Emitted when the input loses focus.                                          | `CustomEvent<FocusEvent>`                                                                                      |
| `scarletBrandChange`    | Emitted whenever the detected card brand changes (including to `undefined`). | `CustomEvent<"amex" \| "diners" \| "discover" \| "elo" \| "hipercard" \| "mastercard" \| "visa" \| undefined>` |
| `scarletChange`         | Emitted when the input loses focus after its value has changed.              | `CustomEvent<string>`                                                                                          |
| `scarletFocus`          | Emitted when the input gains focus.                                          | `CustomEvent<FocusEvent>`                                                                                      |
| `scarletInput`          | Emitted on every keystroke with the current formatted value.                 | `CustomEvent<string>`                                                                                          |
| `scarletValidityChange` | Emitted after a `validate`-triggered check, with the resulting validity.     | `CustomEvent<boolean>`                                                                                         |


## Methods

### `getBrand() => Promise<CreditCardBrand | undefined>`

The detected card network (`'visa'`, `'mastercard'`, ...), or `undefined` if not yet recognizable.

#### Returns

Type: `Promise<CreditCardBrand | undefined>`



### `getRawValue() => Promise<string>`

The raw digits behind the formatted value.

#### Returns

Type: `Promise<string>`



### `isValid() => Promise<boolean>`

Whether the current value passes the Luhn checksum.

#### Returns

Type: `Promise<boolean>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
