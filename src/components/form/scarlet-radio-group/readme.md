# scarlet-radio-group



<!-- Auto Generated Below -->


## Overview

Groups a set of `<scarlet-radio>` options and enforces single selection —
native browser radio grouping does not cross shadow-DOM boundaries, so
this component coordinates `checked`/`name`/`disabled` across its children.

## Properties

| Property     | Attribute    | Description                                                                  | Type                  | Default     |
| ------------ | ------------ | ---------------------------------------------------------------------------- | --------------------- | ----------- |
| `ariaLabel`  | `aria-label` | Accessible label for the group, when there is no visible heading nearby.     | `string \| undefined` | `undefined` |
| `disabled`   | `disabled`   | Disables every radio in the group.                                           | `boolean`             | `false`     |
| `horizontal` | `horizontal` | Lays the radios out in a row instead of stacked.                             | `boolean`             | `false`     |
| `name`       | `name`       | Name applied to every radio in the group, so they submit together in a form. | `string \| undefined` | `undefined` |
| `value`      | `value`      | Value of the currently selected radio.                                       | `string \| undefined` | `undefined` |


## Events

| Event           | Description                              | Type                               |
| --------------- | ---------------------------------------- | ---------------------------------- |
| `scarletChange` | Emitted when the selected value changes. | `CustomEvent<string \| undefined>` |


## Slots

| Slot | Description                                  |
| ---- | -------------------------------------------- |
|      | Default slot for `<scarlet-radio>` children. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
