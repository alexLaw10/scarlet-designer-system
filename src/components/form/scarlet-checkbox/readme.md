# scarlet-checkbox



<!-- Auto Generated Below -->


## Overview

A checkbox input with label, indeterminate state and accessible wiring.

## Properties

| Property        | Attribute       | Description                                                         | Type                  | Default     |
| --------------- | --------------- | ------------------------------------------------------------------- | --------------------- | ----------- |
| `checked`       | `checked`       | Whether the checkbox is checked.                                    | `boolean`             | `false`     |
| `disabled`      | `disabled`      | Disables the checkbox.                                              | `boolean`             | `false`     |
| `indeterminate` | `indeterminate` | Shows a visual "partially checked" state, independent of `checked`. | `boolean`             | `false`     |
| `label`         | `label`         | Visible label rendered next to the checkbox.                        | `string \| undefined` | `undefined` |
| `name`          | `name`          | Name submitted with a parent form.                                  | `string \| undefined` | `undefined` |
| `required`      | `required`      | Marks the checkbox as required in a parent form.                    | `boolean`             | `false`     |
| `value`         | `value`         | Value submitted with a parent form when checked.                    | `string \| undefined` | `undefined` |


## Events

| Event                   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Type                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `scarletChange`         | Emitted when the checked state changes via user interaction.                                                                                                                                                                                                                                                                                                                                                                                                | `CustomEvent<boolean>` |
| `scarletCheckboxChange` | Same payload as `scarletChange`, always bubbling — for a parent `<scarlet-checkbox-group>` to listen to internally instead of the public `scarletChange`. Mirrors `scarlet-radio`'s `scarletRadioChange`: a consumer's own `scarletChange` listener on the *group* would otherwise also catch this bubbling child event (boolean detail) in addition to the group's own re-emission (string[] detail), firing twice with the wrong detail on the first hit. | `CustomEvent<boolean>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
