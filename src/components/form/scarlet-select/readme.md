# scarlet-select



<!-- Auto Generated Below -->


## Overview

A labeled native `<select>` dropdown with helper/error text and built-in
accessibility wiring. Options are passed as a `options` property (an
array), not slotted — native `<select>` cannot reliably project slotted
`<option>` elements into its picker UI across browsers.

## Properties

| Property       | Attribute       | Description                                                                | Type                                   | Default     |
| -------------- | --------------- | -------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `disabled`     | `disabled`      | Disables the select.                                                       | `boolean`                              | `false`     |
| `errorMessage` | `error-message` | Error message rendered below the select. Implies the invalid state.        | `string \| undefined`                  | `undefined` |
| `helperText`   | `helper-text`   | Helper text rendered below the select. Hidden while `errorMessage` is set. | `string \| undefined`                  | `undefined` |
| `invalid`      | `invalid`       | Marks the select as invalid, independent of `errorMessage`.                | `boolean`                              | `false`     |
| `label`        | `label`         | Visible label rendered above the select.                                   | `string \| undefined`                  | `undefined` |
| `name`         | `name`          | Name submitted with a parent form.                                         | `string \| undefined`                  | `undefined` |
| `options`      | --              | Options rendered inside the select.                                        | `ScarletSelectOption[]`                | `[]`        |
| `placeholder`  | `placeholder`   | Placeholder shown as a disabled first option when no value is selected.    | `string \| undefined`                  | `undefined` |
| `required`     | `required`      | Marks the select as required in a parent form.                             | `boolean`                              | `false`     |
| `size`         | `size`          | Size of the select.                                                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`      |
| `value`        | `value`         | Currently selected value.                                                  | `string`                               | `''`        |


## Events

| Event           | Description                              | Type                      |
| --------------- | ---------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the select loses focus.     | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the selected value changes. | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the select gains focus.     | `CustomEvent<FocusEvent>` |


## Methods

### `setFocus() => Promise<void>`

Focuses the internal select element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
