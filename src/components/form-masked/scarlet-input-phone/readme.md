# scarlet-input-phone



<!-- Auto Generated Below -->


## Overview

A Brazilian phone number input — formats as `(11) 91234-5678` (mobile,
11 digits) or `(11) 1234-5678` (landline, 10 digits), switching
automatically as the user types.

## Properties

| Property       | Attribute       | Description                                                               | Type                                   | Default             |
| -------------- | --------------- | ------------------------------------------------------------------------- | -------------------------------------- | ------------------- |
| `disabled`     | `disabled`      | Disables the input.                                                       | `boolean`                              | `false`             |
| `errorMessage` | `error-message` | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                  | `undefined`         |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined`         |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                              | `false`             |
| `label`        | `label`         | Visible label rendered above the input.                                   | `string \| undefined`                  | `undefined`         |
| `name`         | `name`          | Name submitted with a parent form.                                        | `string \| undefined`                  | `undefined`         |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                           | `"(11) 91234-5678"`                    | `'(11) 91234-5678'` |
| `required`     | `required`      | Marks the input as required in a parent form.                             | `boolean`                              | `false`             |
| `size`         | `size`          | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`              |
| `value`        | `value`         | Current formatted value, e.g. `(11) 91234-5678`.                          | `string`                               | `''`                |


## Events

| Event           | Description                                                     | Type                      |
| --------------- | --------------------------------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the input loses focus.                             | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the input loses focus after its value has changed. | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the input gains focus.                             | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current formatted value.    | `CustomEvent<string>`     |


## Methods

### `getRawValue() => Promise<string>`

The raw digits behind the formatted value (e.g. `11912345678`) — what you'd actually submit to an API.

#### Returns

Type: `Promise<string>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
