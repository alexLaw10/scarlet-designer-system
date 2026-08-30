# scarlet-modal



<!-- Auto Generated Below -->


## Overview

A modal dialog built on the native `<dialog>` element, which provides
focus trapping, top-layer stacking and Escape handling for free.

The footer has two independent groups — `footer-start` (left-aligned)
and `footer-end` (right-aligned) — so any mix of button counts works on
either side (1, 2, 3 buttons on one side and/or the other) without any
layout prop: just slot as many `<scarlet-button>`s as needed into
whichever side(s) apply, e.g. a single "Cancelar" in `footer-start` and
both "Voltar"/"Confirmar" in `footer-end`. A side left empty collapses
to nothing — no leftover gap — and the whole footer hides itself when
both are empty.

## Properties

| Property                 | Attribute                   | Description                                                                                                                                                                                                                                | Type                                     | Default     |
| ------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | ----------- |
| `ariaLabel`              | `aria-label`                | Accessible label for the dialog. When omitted, the `header` slot's content is used instead (via `aria-labelledby`) — set this explicitly only when the modal has no visible header, or the header text alone isn't a good accessible name. | `string \| undefined`                    | `undefined` |
| `dismissOnBackdropClick` | `dismiss-on-backdrop-click` | Closes the modal when the backdrop (area outside the dialog box) is clicked.                                                                                                                                                               | `boolean`                                | `true`      |
| `dismissOnEsc`           | `dismiss-on-esc`            | Closes the modal when Escape is pressed.                                                                                                                                                                                                   | `boolean`                                | `true`      |
| `open`                   | `open`                      | Whether the modal is open.                                                                                                                                                                                                                 | `boolean`                                | `false`     |
| `size`                   | `size`                      | Size of the modal.                                                                                                                                                                                                                         | `"full" \| "lg" \| "md" \| "sm" \| "xl"` | `'md'`      |


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

| Slot             | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
|                  | Default slot for the dialog body.                                |
| `"footer-end"`   | Right-aligned footer content, e.g. the primary action button(s). |
| `"footer-start"` | Left-aligned footer content, e.g. a "Cancelar" button.           |
| `"header"`       | Content rendered in the dialog header, e.g. a title.             |


## Shadow Parts

| Part      | Description |
| --------- | ----------- |
| `"close"` |             |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
