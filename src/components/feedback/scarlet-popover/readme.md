# scarlet-popover



<!-- Auto Generated Below -->


## Overview

A generic overlay anchored to a trigger element (the `trigger` slot),
with arbitrary content in the default slot — the shared primitive
`scarlet-menu`/`scarlet-date-picker`/`scarlet-combobox` each built their
own narrower version of for their specific popovers. Use this one
directly for anything that doesn't need a menu list or a calendar grid:
a rich tooltip, a filter panel, a confirmation prompt.

`trigger="click"` (the default) toggles on click, closes on Escape or a
click outside, and sets `aria-haspopup`/`aria-expanded` on whatever's
slotted as the trigger. `trigger="hover"` opens/closes on mouse enter/
leave instead, with no click/Escape handling — matching how a hover
tooltip behaves, not a dialog.

Known limitation: like `scarlet-tooltip`/`scarlet-menu`, positioning is
plain CSS anchored to the trigger — it doesn't flip or reposition to stay
in the viewport.

## Properties

| Property      | Attribute      | Description                                      | Type                                     | Default     |
| ------------- | -------------- | ------------------------------------------------ | ---------------------------------------- | ----------- |
| `ariaLabel`   | `aria-label`   | Accessible label for the popover content region. | `string \| undefined`                    | `undefined` |
| `placement`   | `placement`    | Which side of the trigger the popover opens on.  | `"bottom" \| "left" \| "right" \| "top"` | `'bottom'`  |
| `triggerMode` | `trigger-mode` | What interaction opens/closes the popover.       | `"click" \| "hover"`                     | `'click'`   |


## Events

| Event         | Description                       | Type                |
| ------------- | --------------------------------- | ------------------- |
| `scarletHide` | Emitted after the popover closes. | `CustomEvent<void>` |
| `scarletShow` | Emitted after the popover opens.  | `CustomEvent<void>` |


## Slots

| Slot        | Description                                                                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|             | The popover's content.                                                                                                                                   |
| `"trigger"` | The element that opens the popover — for `trigger="click"`, must be a real, natively focusable/activatable element (a `<button>` or `<scarlet-button>`). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
