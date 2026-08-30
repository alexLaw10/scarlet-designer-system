# scarlet-toast



<!-- Auto Generated Below -->


## Overview

A self-dismissing status message, fixed to a corner of the viewport.
For multiple simultaneous toasts, render several instances inside a
consumer-owned stacking container (this component does not manage a queue).

## Properties

| Property      | Attribute     | Description                                                              | Type                                                                                              | Default          |
| ------------- | ------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------- |
| `dismissible` | `dismissible` | Shows a dismiss (close) button.                                          | `boolean`                                                                                         | `true`           |
| `duration`    | `duration`    | Milliseconds before the toast auto-dismisses. `0` disables auto-dismiss. | `4000`                                                                                            | `4000`           |
| `open`        | `open`        | Whether the toast is visible.                                            | `boolean`                                                                                         | `true`           |
| `position`    | `position`    | Corner of the viewport the toast is anchored to.                         | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"` | `'bottom-right'` |
| `status`      | `status`      | Semantic status of the toast.                                            | `"error" \| "info" \| "success" \| "warning"`                                                     | `'info'`         |


## Events

| Event            | Description                                                                                                                                                                                    | Type                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `scarletDismiss` | Emitted when the toast is dismissed (by timer, close button, or the `open` prop being set to false). Cancelable: call `event.preventDefault()` to keep it visible and handle removal yourself. | `CustomEvent<void>` |


## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
|           | Default slot for the toast message.               |
| `"title"` | Optional slot for a bold title above the message. |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"dismiss"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
