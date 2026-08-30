# scarlet-drawer



<!-- Auto Generated Below -->


## Overview

A panel that slides in from an edge of the screen — the mobile-friendlier
sibling of `scarlet-modal` for a filter panel, a form, a details view.
Built the same way `scarlet-modal` is, on the native `<dialog>` element,
for the same free focus trapping/top-layer stacking/Escape handling — see
that component's own comments for the mechanics shared here (focus
restore, the cancelable `scarletClose`, `show()`/`hide()`).

`size` sets the dimension along the axis the drawer slides on: width for
`left`/`right`, height for `top`/`bottom`.

## Properties

| Property                 | Attribute                   | Description                                                                                                                                                                                                                                 | Type                                     | Default     |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `ariaLabel`              | `aria-label`                | Accessible label for the dialog. When omitted, the `header` slot's content is used instead (via `aria-labelledby`) — set this explicitly only when the drawer has no visible header, or the header text alone isn't a good accessible name. | `string \| undefined`                    | `undefined` |
| `dismissOnBackdropClick` | `dismiss-on-backdrop-click` | Closes the drawer when the backdrop (area outside the panel) is clicked.                                                                                                                                                                    | `boolean`                                | `true`      |
| `dismissOnEsc`           | `dismiss-on-esc`            | Closes the drawer when Escape is pressed.                                                                                                                                                                                                   | `boolean`                                | `true`      |
| `open`                   | `open`                      | Whether the drawer is open.                                                                                                                                                                                                                 | `boolean`                                | `false`     |
| `placement`              | `placement`                 | Which edge of the screen the drawer slides in from.                                                                                                                                                                                         | `"bottom" \| "left" \| "right" \| "top"` | `'right'`   |
| `size`                   | `size`                      | Size along the slide axis: width for `left`/`right`, height for `top`/`bottom`.                                                                                                                                                             | `"lg" \| "md" \| "sm"`                   | `'md'`      |


## Events

| Event          | Description                                                                                                                                                                             | Type                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `scarletClose` | Emitted when the drawer is about to close (Escape, backdrop click, the close button, or the `open` prop being set to false). Cancelable: call `event.preventDefault()` to keep it open. | `CustomEvent<void>` |
| `scarletShow`  | Emitted after the drawer opens.                                                                                                                                                         | `CustomEvent<void>` |


## Methods

### `hide() => Promise<void>`

Requests the drawer to close (fires the cancelable `scarletClose` event first).

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Opens the drawer.

#### Returns

Type: `Promise<void>`




## Slots

| Slot       | Description                                                 |
| ---------- | ----------------------------------------------------------- |
|            | Default slot for the drawer body.                           |
| `"footer"` | Content rendered in the drawer footer, e.g. action buttons. |
| `"header"` | Content rendered in the drawer header, e.g. a title.        |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"close"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
