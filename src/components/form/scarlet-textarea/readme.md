# scarlet-textarea



<!-- Auto Generated Below -->


## Overview

A multi-line labeled text input with helper/error text and built-in accessibility wiring.

## Properties

| Property       | Attribute       | Description                                                                  | Type                                             | Default      |
| -------------- | --------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ | ------------ |
| `disabled`     | `disabled`      | Disables the textarea.                                                       | `boolean`                                        | `false`      |
| `errorMessage` | `error-message` | Error message rendered below the textarea. Implies the invalid state.        | `string \| undefined`                            | `undefined`  |
| `helperText`   | `helper-text`   | Helper text rendered below the textarea. Hidden while `errorMessage` is set. | `string \| undefined`                            | `undefined`  |
| `invalid`      | `invalid`       | Marks the textarea as invalid, independent of `errorMessage`.                | `boolean`                                        | `false`      |
| `label`        | `label`         | Visible label rendered above the textarea.                                   | `string \| undefined`                            | `undefined`  |
| `maxlength`    | `maxlength`     | Maximum number of characters allowed.                                        | `number \| undefined`                            | `undefined`  |
| `name`         | `name`          | Name submitted with a parent form.                                           | `string \| undefined`                            | `undefined`  |
| `placeholder`  | `placeholder`   | Placeholder text shown when the textarea is empty.                           | `string \| undefined`                            | `undefined`  |
| `readonly`     | `readonly`      | Makes the textarea read-only.                                                | `boolean`                                        | `false`      |
| `required`     | `required`      | Marks the textarea as required in a parent form.                             | `boolean`                                        | `false`      |
| `resize`       | `resize`        | Controls whether/how the user can resize the textarea.                       | `"both" \| "horizontal" \| "none" \| "vertical"` | `'vertical'` |
| `rows`         | `rows`          | Number of visible text rows.                                                 | `4`                                              | `4`          |
| `size`         | `size`          | Size of the textarea (affects padding and font size).                        | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`           | `'md'`       |
| `value`        | `value`         | Current value of the textarea.                                               | `string`                                         | `''`         |


## Events

| Event           | Description                                                        | Type                      |
| --------------- | ------------------------------------------------------------------ | ------------------------- |
| `scarletBlur`   | Emitted when the textarea loses focus.                             | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted when the textarea loses focus after its value has changed. | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the textarea gains focus.                             | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current value.                 | `CustomEvent<string>`     |


## Methods

### `setFocus() => Promise<void>`

Focuses the internal textarea element.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
