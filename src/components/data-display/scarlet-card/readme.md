# scarlet-card



<!-- Auto Generated Below -->


## Overview

A container for grouping related content, with optional header/footer slots.

## Properties

| Property      | Attribute     | Description                                                                     | Type                                   | Default      |
| ------------- | ------------- | ------------------------------------------------------------------------------- | -------------------------------------- | ------------ |
| `interactive` | `interactive` | Makes the whole card behave as a single clickable/keyboard-activatable control. | `boolean`                              | `false`      |
| `padding`     | `padding`     | Internal padding of the card body.                                              | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`       |
| `variant`     | `variant`     | Visual style of the card.                                                       | `"elevated" \| "flat" \| "outlined"`   | `'elevated'` |


## Events

| Event          | Description                                                             | Type                                       |
| -------------- | ----------------------------------------------------------------------- | ------------------------------------------ |
| `scarletClick` | Emitted when an interactive card is activated by click, Enter or Space. | `CustomEvent<KeyboardEvent \| MouseEvent>` |


## Slots

| Slot       | Description                                    |
| ---------- | ---------------------------------------------- |
|            | Default slot for the card body.                |
| `"footer"` | Content rendered below the body, e.g. actions. |
| `"header"` | Content rendered above the body, e.g. a title. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
