# scarlet-modal



<!-- Auto Generated Below -->


## Overview

A modal dialog built on the native `<dialog>` element, which provides
focus trapping, top-layer stacking and Escape handling for free.

## Properties

| Property                 | Attribute                   | Description                                                                  | Type                                     | Default     |
| ------------------------ | --------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `ariaLabel`              | `aria-label`                | Accessible label for the dialog, used when there is no visible header slot.  | `string \| undefined`                    | `undefined` |
| `dismissOnBackdropClick` | `dismiss-on-backdrop-click` | Closes the modal when the backdrop (area outside the dialog box) is clicked. | `boolean`                                | `true`      |
| `dismissOnEsc`           | `dismiss-on-esc`            | Closes the modal when Escape is pressed.                                     | `boolean`                                | `true`      |
| `open`                   | `open`                      | Whether the modal is open.                                                   | `boolean`                                | `false`     |
| `size`                   | `size`                      | Size of the modal.                                                           | `"full" \| "lg" \| "md" \| "sm" \| "xl"` | `'md'`      |


## Events

| Event          | Description                                                                                                                                                                            | Type                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `scarletClose` | Emitted when the modal is about to close (Escape, backdrop click, the close button, or the `open` prop being set to false). Cancelable: call `event.preventDefault()` to keep it open. | `CustomEvent<void>` |
| `scarletShow`  | Emitted after the modal opens.                                                                                                                                                         | `CustomEvent<void>` |


## Methods

### `hide() => Promise<void>`

Requests the modal to close (fires the cancelable `scarletClose` event first).

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Opens the modal.

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
|            | Default slot for the dialog body.                           |
| `"footer"` | Content rendered in the dialog footer, e.g. action buttons. |
| `"header"` | Content rendered in the dialog header, e.g. a title.        |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"close"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
