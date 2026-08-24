# scarlet-button



<!-- Auto Generated Below -->


## Overview

A clickable action element with solid, outline, ghost and link variants.

## Properties

| Property    | Attribute    | Description                                                                         | Type                                                                                   | Default     |
| ----------- | ------------ | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------- |
| `ariaLabel` | `aria-label` | Accessible label. Required when the button has no visible text (icon-only buttons). | `string \| undefined`                                                                  | `undefined` |
| `color`     | `color`      | Semantic color of the button.                                                       | `"error" \| "info" \| "neutral" \| "primary" \| "secondary" \| "success" \| "warning"` | `'primary'` |
| `disabled`  | `disabled`   | Disables the button, preventing interaction and the `scarletClick` event.           | `boolean`                                                                              | `false`     |
| `fullWidth` | `full-width` | Stretches the button to fill the width of its container.                            | `boolean`                                                                              | `false`     |
| `loading`   | `loading`    | Shows a loading spinner and blocks interaction, without changing layout width.      | `boolean`                                                                              | `false`     |
| `size`      | `size`       | Size of the button.                                                                 | `"lg" \| "md" \| "sm" \| "xl" \| "xs"`                                                 | `'md'`      |
| `type`      | `type`       | Native `type` attribute passed to the underlying `<button>`.                        | `"button" \| "reset" \| "submit"`                                                      | `'button'`  |
| `variant`   | `variant`    | Visual style of the button.                                                         | `"ghost" \| "link" \| "outline" \| "solid"`                                            | `'solid'`   |


## Events

| Event          | Description                                                                             | Type                      |
| -------------- | --------------------------------------------------------------------------------------- | ------------------------- |
| `scarletClick` | Emitted when the button is activated by click or keyboard, and is not disabled/loading. | `CustomEvent<MouseEvent>` |


## Slots

| Slot      | Description                                     |
| --------- | ----------------------------------------------- |
|           | Default slot for the button label.              |
| `"end"`   | Content placed after the label (e.g. an icon).  |
| `"start"` | Content placed before the label (e.g. an icon). |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"spinner"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
