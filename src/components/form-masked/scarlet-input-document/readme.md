# scarlet-input-document



<!-- Auto Generated Below -->


## Overview

A single "CPF/CNPJ" field that auto-detects and formats whichever
document type is being typed (11 digits → CPF `123.456.789-01`, 12+ →
CNPJ `12.345.678/0001-90`) — the common pattern for a field that accepts
either an individual or a company.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                                                  | Type                                   | Default         |
| -------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------- |
| `disabled`     | `disabled`      | Disables the input.                                                                                                                                                                                                          | `boolean`                              | `false`         |
| `errorMessage` | `error-message` | Error message rendered below the input. Takes priority over automatic check-digit validation errors.                                                                                                                         | `string \| undefined`                  | `undefined`     |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while an error is shown.                                                                                                                                                        | `string \| undefined`                  | `undefined`     |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                                                                                                                                                                   | `boolean`                              | `false`         |
| `label`        | `label`         | Visible label rendered above the input.                                                                                                                                                                                      | `string \| undefined`                  | `undefined`     |
| `name`         | `name`          | Name submitted with a parent form.                                                                                                                                                                                           | `string \| undefined`                  | `undefined`     |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                                                                                                                                                                              | `"CPF ou CNPJ"`                        | `'CPF ou CNPJ'` |
| `required`     | `required`      | Marks the input as required in a parent form.                                                                                                                                                                                | `boolean`                              | `false`         |
| `size`         | `size`          | Size of the input.                                                                                                                                                                                                           | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`          |
| `validate`     | `validate`      | Validates the CPF/CNPJ check digits on blur once the value is complete (11 or 14 digits), showing a default "CPF/CNPJ inválido" message when they don't check out — unless `errorMessage` is already set, which always wins. | `boolean`                              | `true`          |
| `value`        | `value`         | Current formatted value.                                                                                                                                                                                                     | `string`                               | `''`            |


## Events

| Event                   | Description                                                              | Type                      |
| ----------------------- | ------------------------------------------------------------------------ | ------------------------- |
| `scarletBlur`           | Emitted when the input loses focus.                                      | `CustomEvent<FocusEvent>` |
| `scarletChange`         | Emitted when the input loses focus after its value has changed.          | `CustomEvent<string>`     |
| `scarletFocus`          | Emitted when the input gains focus.                                      | `CustomEvent<FocusEvent>` |
| `scarletInput`          | Emitted on every keystroke with the current formatted value.             | `CustomEvent<string>`     |
| `scarletValidityChange` | Emitted after a `validate`-triggered check, with the resulting validity. | `CustomEvent<boolean>`    |


## Methods

### `getDocumentType() => Promise<ScarletDocumentType | undefined>`

`'cpf'` or `'cnpj'` based on the current digit count, or `undefined` if empty.

#### Returns

Type: `Promise<ScarletDocumentType | undefined>`



### `getRawValue() => Promise<string>`

The raw digits behind the formatted value.

#### Returns

Type: `Promise<string>`



### `isValid() => Promise<boolean>`

Whether the current value is a complete, check-digit-valid CPF or CNPJ.

#### Returns

Type: `Promise<boolean>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
