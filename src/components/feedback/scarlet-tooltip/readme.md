# scarlet-tooltip



<!-- Auto Generated Below -->


## Overview

A text hint shown next to its trigger on hover/focus. Positioning is
plain CSS anchored to the host — it does not flip to stay in the
viewport, so pick a `placement` that has room to render.

## Properties

| Property    | Attribute   | Description                                        | Type                                     | Default     |
| ----------- | ----------- | -------------------------------------------------- | ---------------------------------------- | ----------- |
| `content`   | `content`   | Text content of the tooltip.                       | `string \| undefined`                    | `undefined` |
| `delay`     | `delay`     | Delay in milliseconds before the tooltip appears.  | `200`                                    | `200`       |
| `disabled`  | `disabled`  | Disables the tooltip entirely.                     | `boolean`                                | `false`     |
| `placement` | `placement` | Where the tooltip renders relative to its trigger. | `"bottom" \| "left" \| "right" \| "top"` | `'top'`     |


## Events

| Event         | Description                               | Type                |
| ------------- | ----------------------------------------- | ------------------- |
| `scarletHide` | Emitted when the tooltip is hidden.       | `CustomEvent<void>` |
| `scarletShow` | Emitted when the tooltip becomes visible. | `CustomEvent<void>` |


## Slots

| Slot | Description                                                         |
| ---- | ------------------------------------------------------------------- |
|      | The trigger element (e.g. a button or icon) that shows the tooltip. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
