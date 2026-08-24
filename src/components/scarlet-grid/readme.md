# scarlet-grid



<!-- Auto Generated Below -->


## Overview

A CSS grid layout primitive with equal-width columns and token-based
gaps. Pair with `<scarlet-grid-item>` to span multiple columns/rows.

## Properties

| Property    | Attribute    | Description                                                                                                            | Type                                                | Default     |
| ----------- | ------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `align`     | `align`      | Cross-axis alignment (`align-items`) for items within their cell.                                                      | `"center" \| "end" \| "start" \| "stretch"`         | `'stretch'` |
| `columnGap` | `column-gap` | Overrides the column gap.                                                                                              | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| undefined` | `undefined` |
| `columns`   | `columns`    | Number of equal-width columns.                                                                                         | `12`                                                | `12`        |
| `gap`       | `gap`        | Gap between rows and columns, from the design system's spacing scale. Overridden individually by `rowGap`/`columnGap`. | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`              | `'md'`      |
| `rowGap`    | `row-gap`    | Overrides the row gap.                                                                                                 | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| undefined` | `undefined` |


## Slots

| Slot | Description           |
| ---- | --------------------- |
|      | The items to lay out. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
