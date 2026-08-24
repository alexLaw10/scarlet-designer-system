# scarlet-switch



<!-- Auto Generated Below -->


## Overview

A toggle switch for binary on/off settings.

## Properties

| Property   | Attribute  | Description                                    | Type                  | Default     |
| ---------- | ---------- | ---------------------------------------------- | --------------------- | ----------- |
| `checked`  | `checked`  | Whether the switch is on.                      | `boolean`             | `false`     |
| `disabled` | `disabled` | Disables the switch.                           | `boolean`             | `false`     |
| `label`    | `label`    | Visible label rendered next to the switch.     | `string \| undefined` | `undefined` |
| `name`     | `name`     | Name submitted with a parent form.             | `string \| undefined` | `undefined` |
| `required` | `required` | Marks the switch as required in a parent form. | `boolean`             | `false`     |
| `value`    | `value`    | Value submitted with a parent form when on.    | `string \| undefined` | `undefined` |


## Events

| Event           | Description                                                 | Type                   |
| --------------- | ----------------------------------------------------------- | ---------------------- |
| `scarletChange` | Emitted when the on/off state changes via user interaction. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
