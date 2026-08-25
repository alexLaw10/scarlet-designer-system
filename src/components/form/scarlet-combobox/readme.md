# scarlet-combobox



<!-- Auto Generated Below -->


## Overview

A searchable select — type to filter a list of options, following the
WAI-ARIA 1.2 "editable combobox with list autocomplete" pattern. Unlike
`scarlet-menu`/`scarlet-date-picker`'s popovers, DOM focus never leaves
the text input while the list is open: the highlighted option is tracked
with `aria-activedescendant` instead of moving real focus button-to-
button, so the user can keep typing without ever losing their place.

Known limitation: like `scarlet-tooltip`/`scarlet-date-picker`/
`scarlet-menu`, positioning is plain CSS anchored to the field — it
doesn't flip or reposition to stay in the viewport.

## Properties

| Property           | Attribute            | Description                                                           | Type                                   | Default                          |
| ------------------ | -------------------- | --------------------------------------------------------------------- | -------------------------------------- | -------------------------------- |
| `disabled`         | `disabled`           | Disables the field.                                                   | `boolean`                              | `false`                          |
| `errorMessage`     | `error-message`      | Error message rendered below the field. Implies the invalid state.    | `string \| undefined`                  | `undefined`                      |
| `helperText`       | `helper-text`        | Helper text rendered below the field. Hidden while an error is shown. | `string \| undefined`                  | `undefined`                      |
| `invalid`          | `invalid`            | Marks the field as invalid, independent of `errorMessage`.            | `boolean`                              | `false`                          |
| `label`            | `label`              | Visible label rendered above the field.                               | `string \| undefined`                  | `undefined`                      |
| `noResultsMessage` | `no-results-message` | Message shown in the list when no option matches the current query.   | `"Nenhum resultado encontrado."`       | `'Nenhum resultado encontrado.'` |
| `options`          | --                   | The options to search through.                                        | `ScarletComboboxOption[]`              | `[]`                             |
| `placeholder`      | `placeholder`        | Placeholder text shown when nothing is typed.                         | `string \| undefined`                  | `undefined`                      |
| `required`         | `required`           | Marks the field as required in a parent form.                         | `boolean`                              | `false`                          |
| `size`             | `size`               | Size of the field.                                                    | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`                           |
| `value`            | `value`              | Value of the currently selected option.                               | `string`                               | `''`                             |


## Events

| Event           | Description                                                                      | Type                      |
| --------------- | -------------------------------------------------------------------------------- | ------------------------- |
| `scarletBlur`   | Emitted when the field loses focus.                                              | `CustomEvent<FocusEvent>` |
| `scarletChange` | Emitted with the newly selected option's value when an option is picked.         | `CustomEvent<string>`     |
| `scarletFocus`  | Emitted when the field gains focus.                                              | `CustomEvent<FocusEvent>` |
| `scarletInput`  | Emitted on every keystroke with the current query text (not the selected value). | `CustomEvent<string>`     |


## Methods

### `setFocus() => Promise<void>`

Focuses the internal text input.

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
