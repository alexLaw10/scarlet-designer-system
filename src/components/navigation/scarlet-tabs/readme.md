# scarlet-tabs



<!-- Auto Generated Below -->


## Overview

A set of tabs with associated panels. Panel content is projected via a
named slot per item, matching `item.value`.

## Properties

| Property | Attribute | Description                                                              | Type                  | Default     |
| -------- | --------- | ------------------------------------------------------------------------ | --------------------- | ----------- |
| `items`  | --        | The tabs to render.                                                      | `ScarletTabItem[]`    | `[]`        |
| `value`  | `value`   | Value of the currently selected tab. Defaults to the first enabled item. | `string \| undefined` | `undefined` |


## Events

| Event           | Description                            | Type                  |
| --------------- | -------------------------------------- | --------------------- |
| `scarletChange` | Emitted when the selected tab changes. | `CustomEvent<string>` |


## Slots

| Slot             | Description                                          |
| ---------------- | ---------------------------------------------------- |
| `"[item.value]"` | Panel content for each tab, one slot per item value. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
