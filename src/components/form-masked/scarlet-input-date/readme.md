# scarlet-input-date



<!-- Auto Generated Below -->


## Overview

A `DD/MM/AAAA` date input. Unlike a plain positional mask, `validate`
checks it's a *real* calendar date (rejects `31/02/2026`, honors leap
years) on blur, not just that 8 digits were typed.

## Properties

| Property       | Attribute       | Description                                                                                                                                                                                           | Type                                   | Default        |
| -------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------- |
| `disabled`     | `disabled`      | Disables the input.                                                                                                                                                                                   | `boolean`                              | `false`        |
| `errorMessage` | `error-message` | Error message rendered below the input. Takes priority over automatic calendar validation errors.                                                                                                     | `string \| undefined`                  | `undefined`    |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while an error is shown.                                                                                                                                 | `string \| undefined`                  | `undefined`    |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                                                                                                                                            | `boolean`                              | `false`        |
| `label`        | `label`         | Visible label rendered above the input.                                                                                                                                                               | `string \| undefined`                  | `undefined`    |
| `name`         | `name`          | Name submitted with a parent form.                                                                                                                                                                    | `string \| undefined`                  | `undefined`    |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                                                                                                                                                       | `"DD/MM/AAAA"`                         | `'DD/MM/AAAA'` |
| `required`     | `required`      | Marks the input as required in a parent form.                                                                                                                                                         | `boolean`                              | `false`        |
| `size`         | `size`          | Size of the input.                                                                                                                                                                                    | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`         |
| `validate`     | `validate`      | Validates the value is a real calendar date on blur once it's complete (8 digits), showing a default "Data inválida" message when it isn't — unless `errorMessage` is already set, which always wins. | `boolean`                              | `true`         |
| `value`        | `value`         | Current formatted value, e.g. `31/12/2026`.                                                                                                                                                           | `string`                               | `''`           |


## Events

| Event                   | Description                                                              | Type                      |
| ----------------------- | ------------------------------------------------------------------------ | ------------------------- |
| `scarletBlur`           | Emitted when the input loses focus.                                      | `CustomEvent<FocusEvent>` |
| `scarletChange`         | Emitted when the input loses focus after its value has changed.          | `CustomEvent<string>`     |
| `scarletFocus`          | Emitted when the input gains focus.                                      | `CustomEvent<FocusEvent>` |
| `scarletInput`          | Emitted on every keystroke with the current formatted value.             | `CustomEvent<string>`     |
| `scarletValidityChange` | Emitted after a `validate`-triggered check, with the resulting validity. | `CustomEvent<boolean>`    |


## Methods

### `isValid() => Promise<boolean>`

Whether the current value is a complete, real calendar date.

#### Returns

Type: `Promise<boolean>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`



### `toDate() => Promise<Date | undefined>`

The value as a native `Date`, or `undefined` if it isn't a complete valid date.

#### Returns

Type: `Promise<Date | undefined>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
