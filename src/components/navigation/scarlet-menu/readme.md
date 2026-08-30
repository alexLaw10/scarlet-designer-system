# scarlet-menu



<!-- Auto Generated Below -->


## Overview

A dropdown menu of actions opened from an arbitrary trigger element (the
`trigger` slot — typically an icon button like "⋮"), following the
WAI-ARIA menu button pattern: the trigger gets `aria-haspopup="menu"`/
`aria-expanded` (set directly on whatever element is slotted in), the
popover is `role="menu"` with `role="menuitem"` buttons, arrow keys move
a roving tab stop within the list, Home/End jump to the first/last enabled
item, Escape closes and returns focus to the trigger. Enter/Space opening
the menu is *not* handled here — the trigger must be a real, natively
activatable element (a `<button>` or `<scarlet-button>`); its own native
click already opens the menu, and re-handling those keys here would fire
twice (open, then immediately close again from the resulting click).

Known limitation: like `scarlet-tooltip`/`scarlet-date-picker`,
positioning is plain CSS anchored to the trigger — it doesn't flip or
reposition to stay in the viewport, and it doesn't close on Tab-ing past
its last item.

## Properties

| Property    | Attribute    | Description                                                                                             | Type                | Default   |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------- | ------------------- | --------- |
| `ariaLabel` | `aria-label` | Accessible label for the menu list, when the trigger's own accessible name doesn't already describe it. | `"Menu"`            | `'Menu'`  |
| `items`     | --           | The actions to list.                                                                                    | `ScarletMenuItem[]` | `[]`      |
| `placement` | `placement`  | Which side of the trigger the menu aligns to.                                                           | `"end" \| "start"`  | `'start'` |


## Events

| Event           | Description                                                          | Type                           |
| --------------- | -------------------------------------------------------------------- | ------------------------------ |
| `scarletHide`   | Emitted after the menu closes.                                       | `CustomEvent<void>`            |
| `scarletSelect` | Emitted when an enabled item is picked. The menu closes right after. | `CustomEvent<ScarletMenuItem>` |
| `scarletShow`   | Emitted after the menu opens.                                        | `CustomEvent<void>`            |


## Slots

| Slot        | Description                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `"trigger"` | The element that opens the menu — must be a real, natively focusable/activatable element (a `<button>` or `<scarlet-button>`). |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
