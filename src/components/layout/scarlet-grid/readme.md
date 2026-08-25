# scarlet-grid



<!-- Auto Generated Below -->


## Overview

A CSS grid layout primitive with equal-width columns and token-based
gaps. Pair with `<scarlet-grid-item>` to span multiple columns/rows.

`columns` can change per breakpoint via `columnsSm`/`columnsMd`/
`columnsLg`/`columnsXl` — each one only takes effect from its breakpoint
up and, left unset, falls back to the next smaller breakpoint that *is*
set (mobile-first cascade), down to `columns` itself. E.g. `columns={1}
columns-md={3}` renders 1 column below 768px and 3 from 768px up, with
no separate `sm`/`lg`/`xl` value needed.

## Properties

| Property    | Attribute    | Description                                                                                                                | Type                                                | Default     |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------- |
| `align`     | `align`      | Cross-axis alignment (`align-items`) for items within their cell.                                                          | `"center" \| "end" \| "start" \| "stretch"`         | `'stretch'` |
| `columnGap` | `column-gap` | Overrides the column gap.                                                                                                  | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| undefined` | `undefined` |
| `columns`   | `columns`    | Number of equal-width columns below the `sm` breakpoint (or at every size, if no responsive override is set).              | `12`                                                | `12`        |
| `columnsLg` | `columns-lg` | Column count from the `lg` breakpoint (1024px) up. Falls back to `columnsMd`/`columnsSm`/`columns` when unset.             | `number \| undefined`                               | `undefined` |
| `columnsMd` | `columns-md` | Column count from the `md` breakpoint (768px) up. Falls back to `columnsSm`/`columns` when unset.                          | `number \| undefined`                               | `undefined` |
| `columnsSm` | `columns-sm` | Column count from the `sm` breakpoint (640px) up. Falls back to `columns` when unset.                                      | `number \| undefined`                               | `undefined` |
| `columnsXl` | `columns-xl` | Column count from the `xl` breakpoint (1280px) up. Falls back to `columnsLg`/`columnsMd`/`columnsSm`/`columns` when unset. | `number \| undefined`                               | `undefined` |
| `gap`       | `gap`        | Gap between rows and columns, from the design system's spacing scale. Overridden individually by `rowGap`/`columnGap`.     | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`              | `'md'`      |
| `rowGap`    | `row-gap`    | Overrides the row gap.                                                                                                     | `"lg" \| "md" \| "sm" \| "xl" \| "xs" \| undefined` | `undefined` |


## Slots

| Slot | Description           |
| ---- | --------------------- |
|      | The items to lay out. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
