# scarlet-stack



<!-- Auto Generated Below -->


## Overview

A flexbox layout primitive for stacking or rowing children with
consistent, token-based spacing.

`direction` can change per breakpoint via `directionSm`/`directionMd`/
`directionLg`/`directionXl` — the classic "stacked on mobile, row on
desktop" pattern is `direction="column" direction-md="row"`. Each one
only takes effect from its breakpoint up and, left unset, falls back to
the next smaller breakpoint that *is* set (mobile-first cascade), down
to `direction` itself.

## Properties

| Property      | Attribute      | Description                                                                                                                          | Type                                                                  | Default     |
| ------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------- |
| `align`       | `align`        | Cross-axis alignment (`align-items`).                                                                                                | `"center" \| "end" \| "start" \| "stretch"`                           | `'stretch'` |
| `direction`   | `direction`    | Flex direction below the `sm` breakpoint (or at every size, if no responsive override is set).                                       | `"column" \| "column-reverse" \| "row" \| "row-reverse"`              | `'column'`  |
| `directionLg` | `direction-lg` | Flex direction from the `lg` breakpoint (1024px) up. Falls back to `directionMd`/`directionSm`/`direction` when unset.               | `"column" \| "column-reverse" \| "row" \| "row-reverse" \| undefined` | `undefined` |
| `directionMd` | `direction-md` | Flex direction from the `md` breakpoint (768px) up. Falls back to `directionSm`/`direction` when unset.                              | `"column" \| "column-reverse" \| "row" \| "row-reverse" \| undefined` | `undefined` |
| `directionSm` | `direction-sm` | Flex direction from the `sm` breakpoint (640px) up. Falls back to `direction` when unset.                                            | `"column" \| "column-reverse" \| "row" \| "row-reverse" \| undefined` | `undefined` |
| `directionXl` | `direction-xl` | Flex direction from the `xl` breakpoint (1280px) up. Falls back to `directionLg`/`directionMd`/`directionSm`/`direction` when unset. | `"column" \| "column-reverse" \| "row" \| "row-reverse" \| undefined` | `undefined` |
| `gap`         | `gap`          | Space between items, from the design system's spacing scale.                                                                         | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`                                | `'md'`      |
| `justify`     | `justify`      | Main-axis distribution (`justify-content`).                                                                                          | `"around" \| "between" \| "center" \| "end" \| "evenly" \| "start"`   | `'start'`   |
| `wrap`        | `wrap`         | Whether items wrap onto multiple lines.                                                                                              | `"nowrap" \| "wrap" \| "wrap-reverse"`                                | `'nowrap'`  |


## Slots

| Slot | Description           |
| ---- | --------------------- |
|      | The items to lay out. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
