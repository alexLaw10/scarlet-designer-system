# scarlet-progress



<!-- Auto Generated Below -->


## Overview

A determinate progress bar (0–100%) — for a file upload, a multi-step
form, anything with a real, known completion percentage. For an
indeterminate "something's happening" state, use `scarlet-spinner`.

## Properties

| Property    | Attribute    | Description                                     | Type                                                                                   | Default       |
| ----------- | ------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------- | ------------- |
| `ariaLabel` | `aria-label` | Accessible label for the `progressbar` role.    | `"Progresso"`                                                                          | `'Progresso'` |
| `color`     | `color`      | Semantic color of the filled portion.           | `"error" \| "info" \| "neutral" \| "primary" \| "secondary" \| "success" \| "warning"` | `'primary'`   |
| `max`       | `max`        | Value that represents 100%.                     | `100`                                                                                  | `100`         |
| `showLabel` | `show-label` | Shows the percentage as text next to the track. | `boolean`                                                                              | `false`       |
| `size`      | `size`       | Height of the track.                            | `"lg" \| "md" \| "sm"`                                                                 | `'md'`        |
| `value`     | `value`      | Current value.                                  | `0`                                                                                    | `0`           |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
