# scarlet-radio



<!-- Auto Generated Below -->


## Overview

A single radio option. Use inside a `<scarlet-radio-group>` for mutually
exclusive selection — standalone, it behaves like an isolated toggle.

## Properties

| Property   | Attribute  | Description                                                                                    | Type                  | Default     |
| ---------- | ---------- | ---------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `checked`  | `checked`  | Whether this radio is selected. Managed by the parent `<scarlet-radio-group>` when present.    | `boolean`             | `false`     |
| `disabled` | `disabled` | Disables this radio. Set by a parent `<scarlet-radio-group>` when the whole group is disabled. | `boolean`             | `false`     |
| `label`    | `label`    | Visible label rendered next to the radio.                                                      | `string \| undefined` | `undefined` |
| `name`     | `name`     | Name submitted with a parent form. Set by a parent `<scarlet-radio-group>` when present.       | `string \| undefined` | `undefined` |
| `value`    | `value`    | Value identifying this option within its group.                                                | `string \| undefined` | `undefined` |


## Events

| Event           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Type                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `scarletChange` | Emitted when this radio becomes selected via user interaction. Deliberately non-bubbling: a parent `<scarlet-radio-group>` re-emits its own `scarletChange` (with a different, string `detail`) once it has processed this one, so this event must never reach a listener attached to the group too, or such a listener would see both fire under the same name. Listen directly on the radio (which still works for standalone usage — the "at target" phase runs regardless of `bubbles`) or on the group, not both. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
