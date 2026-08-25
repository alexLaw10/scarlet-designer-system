# scarlet-input



<!-- Auto Generated Below -->


## Overview

A labeled text input with helper/error text and built-in accessibility wiring.

## Properties

| Property       | Attribute       | Description                                                               | Type                                                                        | Default     |
| -------------- | --------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| `autocomplete` | `autocomplete`  | Native `autocomplete` attribute.                                          | `string \| undefined`                                                       | `undefined` |
| `disabled`     | `disabled`      | Disables the input.                                                       | `boolean`                                                                   | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                                                       | `undefined` |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                                                       | `undefined` |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                                                                   | `false`     |
| `label`        | `label`         | Visible label rendered above the input.                                   | `string \| undefined`                                                       | `undefined` |
| `name`         | `name`          | Name submitted with a parent form.                                        | `string \| undefined`                                                       | `undefined` |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                           | `string \| undefined`                                                       | `undefined` |
| `readonly`     | `readonly`      | Makes the input read-only.                                                | `boolean`                                                                   | `false`     |
| `required`     | `required`      | Marks the input as required in a parent form.                             | `boolean`                                                                   | `false`     |
| `size`         | `size`          | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`                                      | `'md'`      |
| `type`         | `type`          | Native input type.                                                        | `"email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'text'`    |
| `value`        | `value`         | Current value of the input.                                               | `string`                                                                    | `''`        |


## Events

| Event           | Description                                                     | Type                      |
| --------------- | --------------------------------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the input loses focus.                             | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the input loses focus after its value has changed. | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the input gains focus.                             | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current value.              | `CustomEvent<string>`     |


## Methods

### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
