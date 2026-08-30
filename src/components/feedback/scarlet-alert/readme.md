# scarlet-alert



<!-- Auto Generated Below -->


## Overview

An inline status message with optional title, icon and dismiss action.

## Properties

| Property      | Attribute     | Description                             | Type                                          | Default  |
| ------------- | ------------- | --------------------------------------- | --------------------------------------------- | -------- |
| `dismissible` | `dismissible` | Shows a dismiss (close) button.         | `boolean`                                     | `false`  |
| `icon`        | `icon`        | Shows a status icon before the content. | `boolean`                                     | `true`   |
| `status`      | `status`      | Semantic status of the alert.           | `"error" \| "info" \| "success" \| "warning"` | `'info'` |
| `variant`     | `variant`     | Visual style of the alert.              | `"outline" \| "soft" \| "solid"`              | `'soft'` |


## Events

| Event            | Description                                                                                                                                                                                       | Type                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `scarletDismiss` | Emitted when the dismiss button is activated. The event is cancelable: call `event.preventDefault()` to keep the alert visible and handle removal yourself (e.g. to run a custom exit animation). | `CustomEvent<void>` |


## Slots

| Slot      | Description                                       |
| --------- | ------------------------------------------------- |
|           | Default slot for the alert message.               |
| `"title"` | Optional slot for a bold title above the message. |


## Shadow Parts

| Part        | Description |
| ----------- | ----------- |
| `"dismiss"` |             |
| `"icon"`    |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
