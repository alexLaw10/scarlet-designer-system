# scarlet-input-percentage



<!-- Auto Generated Below -->


## Overview

A percentage input that formats digits growing from the right, like
`scarlet-input-currency` — typing "1234" produces "12,34%". Emits the
plain numeric percentage (e.g. `12.34`) via `scarletInput`/`scarletChange`.

## Properties

| Property       | Attribute       | Description                                                               | Type                                   | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `decimals`     | `decimals`      | How many digits are kept after the decimal comma.                         | `2`                                    | `2`         |
| `disabled`     | `disabled`      | Disables the input.                                                       | `boolean`                              | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                  | `undefined` |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined` |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                              | `false`     |
| `label`        | `label`         | Visible label rendered above the input.                                   | `string \| undefined`                  | `undefined` |
| `name`         | `name`          | Name submitted with a parent form.                                        | `string \| undefined`                  | `undefined` |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                           | `"0,00%"`                              | `'0,00%'`   |
| `required`     | `required`      | Marks the input as required in a parent form.                             | `boolean`                              | `false`     |
| `size`         | `size`          | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`      |
| `value`        | `value`         | Current formatted value, e.g. `12,34%`.                                   | `string`                               | `''`        |


## Events

| Event           | Description                                                                                          | Type                      |
| --------------- | ---------------------------------------------------------------------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the input loses focus.                                                                  | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the input loses focus after its value has changed, with the current numeric percentage. | `CustomEvent<number>`     |
| `scarletFocus`  | Emitted when the input gains focus.                                                                  | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current numeric percentage (e.g. `12.34`).                       | `CustomEvent<number>`     |


## Methods

### `getNumericValue() => Promise<number>`

The current percentage as a plain number (same value `scarletInput`/`scarletChange` emit).

#### Returns

Type: `Promise<number>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
