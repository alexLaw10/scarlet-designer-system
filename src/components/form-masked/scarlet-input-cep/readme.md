# scarlet-input-cep



<!-- Auto Generated Below -->


## Overview

A Brazilian postal code (CEP) input — formats as `01310-100`. This
component only formats the value; looking up the matching address (e.g.
via ViaCEP) is the consuming app's responsibility — listen for
`scarletChange` and call your own API with `getRawValue()`.

## Properties

| Property       | Attribute       | Description                                                               | Type                                   | Default       |
| -------------- | --------------- | ------------------------------------------------------------------------- | -------------------------------------- | ------------- |
| `disabled`     | `disabled`      | Disables the input.                                                       | `boolean`                              | `false`       |
| `errorMessage` | `error-message` | Error message rendered below the input. Implies the invalid state.        | `string \| undefined`                  | `undefined`   |
| `helperText`   | `helper-text`   | Helper text rendered below the input. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined`   |
| `invalid`      | `invalid`       | Marks the input as invalid, independent of `errorMessage`.                | `boolean`                              | `false`       |
| `label`        | `label`         | Visible label rendered above the input.                                   | `string \| undefined`                  | `undefined`   |
| `name`         | `name`          | Name submitted with a parent form.                                        | `string \| undefined`                  | `undefined`   |
| `placeholder`  | `placeholder`   | Placeholder text shown when the input is empty.                           | `"00000-000"`                          | `'00000-000'` |
| `required`     | `required`      | Marks the input as required in a parent form.                             | `boolean`                              | `false`       |
| `size`         | `size`          | Size of the input.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`        |
| `value`        | `value`         | Current formatted value, e.g. `01310-100`.                                | `string`                               | `''`          |


## Events

| Event             | Description                                                                                                                                                                                                          | Type                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `scarletBlur`     | Emitted when the input loses focus.                                                                                                                                                                                  | `CustomEvent<FocusEvent>` |
| `scarletChange`   | Emitted when the input loses focus after its value has changed. Also emitted as soon as the 8th digit is typed (`scarletComplete`) — the more useful hook for triggering an address lookup without waiting for blur. | `CustomEvent<string>`     |
| `scarletComplete` | Emitted once the value reaches 8 digits (a complete CEP), on every keystroke that keeps it complete.                                                                                                                 | `CustomEvent<string>`     |
| `scarletFocus`    | Emitted when the input gains focus.                                                                                                                                                                                  | `CustomEvent<FocusEvent>` |
| `scarletInput`    | Emitted on every keystroke with the current formatted value.                                                                                                                                                         | `CustomEvent<string>`     |


## Methods

### `getRawValue() => Promise<string>`

The raw 8 digits behind the formatted value (e.g. `01310100`).

#### Returns

Type: `Promise<string>`



### `setFocus() => Promise<void>`

Focuses the internal input element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
