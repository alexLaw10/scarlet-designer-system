# scarlet-accordion



<!-- Auto Generated Below -->


## Overview

A set of collapsible sections. Panel content is projected via a named
slot per item, matching `item.value`.

## Properties

| Property         | Attribute  | Description                                                   | Type                     | Default |
| ---------------- | ---------- | ------------------------------------------------------------- | ------------------------ | ------- |
| `expandedValues` | --         | Values of the currently expanded sections.                    | `string[]`               | `[]`    |
| `items`          | --         | The sections to render.                                       | `ScarletAccordionItem[]` | `[]`    |
| `multiple`       | `multiple` | Allows more than one section to be expanded at the same time. | `boolean`                | `false` |


## Events

| Event           | Description                                        | Type                    |
| --------------- | -------------------------------------------------- | ----------------------- |
| `scarletChange` | Emitted when the set of expanded sections changes. | `CustomEvent<string[]>` |


## Slots

| Slot             | Description                                              |
| ---------------- | -------------------------------------------------------- |
| `"[item.value]"` | Panel content for each section, one slot per item value. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
