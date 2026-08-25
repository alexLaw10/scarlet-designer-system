# scarlet-toolbar



<!-- Auto Generated Below -->


## Overview

A horizontal bar for grouping related actions (buttons, a search field,
an icon menu) — `role="toolbar"` with token-based gap, distinct from
`scarlet-stack` in intent (actions, not arbitrary layout) even though
the underlying flex mechanics are similar.

## Properties

| Property    | Attribute    | Description                                                                                            | Type                                                                | Default     |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------- |
| `ariaLabel` | `aria-label` | Accessible label for the `toolbar` role — required whenever there's more than one toolbar on the page. | `string \| undefined`                                               | `undefined` |
| `justify`   | `justify`    | Main-axis distribution of items.                                                                       | `"around" \| "between" \| "center" \| "end" \| "evenly" \| "start"` | `'start'`   |


## Slots

| Slot | Description                    |
| ---- | ------------------------------ |
|      | The toolbar's items, in order. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
