# scarlet-checkbox-group



<!-- Auto Generated Below -->


## Overview

Groups a set of `<scarlet-checkbox>` options and coordinates which ones
are checked as a single `value` array — unlike `<scarlet-radio-group>`,
each checkbox keeps its own native Tab stop (WAI-ARIA's `group` role, not
`radiogroup`, doesn't call for roving tabindex/arrow-key navigation the
way a radio group does).

## Properties

| Property     | Attribute    | Description                                                                     | Type                  | Default     |
| ------------ | ------------ | ------------------------------------------------------------------------------- | --------------------- | ----------- |
| `ariaLabel`  | `aria-label` | Accessible label for the group, when there is no visible heading nearby.        | `string \| undefined` | `undefined` |
| `disabled`   | `disabled`   | Disables every checkbox in the group.                                           | `boolean`             | `false`     |
| `horizontal` | `horizontal` | Lays the checkboxes out in a row instead of stacked.                            | `boolean`             | `false`     |
| `name`       | `name`       | Name applied to every checkbox in the group, so they submit together in a form. | `string \| undefined` | `undefined` |
| `value`      | --           | Values of the currently checked checkboxes.                                     | `string[]`            | `[]`        |


## Events

| Event           | Description                                     | Type                    |
| --------------- | ----------------------------------------------- | ----------------------- |
| `scarletChange` | Emitted when the set of checked values changes. | `CustomEvent<string[]>` |


## Slots

| Slot | Description                                     |
| ---- | ----------------------------------------------- |
|      | Default slot for `<scarlet-checkbox>` children. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
