# scarlet-avatar-group



<!-- Auto Generated Below -->


## Overview

Overlaps a set of `<scarlet-avatar>` children into a stack, with an
optional "+N" indicator when there are more than `max`. Propagates `size`
down to every avatar so they all render at the same size regardless of
what each one was given individually.

## Properties

| Property | Attribute | Description                                                                                               | Type                                   | Default     |
| -------- | --------- | --------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `max`    | `max`     | Caps how many avatars are shown before the rest collapse into a "+N" indicator. Unset shows every avatar. | `number \| undefined`                  | `undefined` |
| `size`   | `size`    | Size applied to every avatar in the group.                                                                | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`      |


## Slots

| Slot | Description                                   |
| ---- | --------------------------------------------- |
|      | Default slot for `<scarlet-avatar>` children. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
