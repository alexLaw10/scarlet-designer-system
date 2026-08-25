# scarlet-input-license-plate



<!-- Auto Generated Below -->


## Overview

A Brazilian vehicle plate input — formats as the old `ABC-1234` pattern
or the newer Mercosul `ABC1D23` pattern, detected automatically from
whether a letter or digit lands in the 5th character.

## Properties

| Property       | Attribute       | Description                                                               | Type                                   | Default      |
| -------------- | --------------- | ------------------------------------------------------------------------- | -------------------------------------- | ------------ |
| `disabled`     | `disabled`      | Disables the input.                                                       | `boolean`                              | `false`      |
| `errorMessage` | `error-message` | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                  | `undefined`  |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined`  |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                              | `false`      |
| `label`        | `label`         | Visible label rendered above the input.                                   | `string \| undefined`                  | `undefined`  |
| `name`         | `name`          | Name submitted with a parent form.                                        | `string \| undefined`                  | `undefined`  |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                           | `"ABC-1234"`                           | `'ABC-1234'` |
| `required`     | `required`      | Marks the input as required in a parent form.                             | `boolean`                              | `false`      |
| `size`         | `size`          | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`       |
| `value`        | `value`         | Current formatted value, e.g. `ABC-1234` or `ABC1D23`.                    | `string`                               | `''`         |


## Events

| Event           | Description                                                     | Type                      |
| --------------- | --------------------------------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the input loses focus.                             | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the input loses focus after its value has changed. | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the input gains focus.                             | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current formatted value.    | `CustomEvent<string>`     |


## Methods

### `getFormat() => Promise<ScarletLicensePlateFormat | undefined>`

Whether the current value looks like a complete old-format or Mercosul plate.

#### Returns

Type: `Promise<ScarletLicensePlateFormat | undefined>`



### `getRawValue() => Promise<string>`

The raw alphanumeric characters behind the formatted value (no dash).

#### Returns

Type: `Promise<string>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
