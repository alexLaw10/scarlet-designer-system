# scarlet-avatar



<!-- Auto Generated Below -->


## Overview

A user/entity avatar: shows an image, falling back to initials derived
from `name`, falling back to a generic icon.

## Properties

| Property | Attribute | Description                                                         | Type                                   | Default     |
| -------- | --------- | ------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `alt`    | `alt`     | Accessible alt text for the image. Defaults to `name` when omitted. | `string \| undefined`                  | `undefined` |
| `name`   | `name`    | Full name used to derive initials and the default alt text.         | `string \| undefined`                  | `undefined` |
| `shape`  | `shape`   | Shape of the avatar.                                                | `"circle" \| "square"`                 | `'circle'`  |
| `size`   | `size`    | Size of the avatar.                                                 | `"lg" \| "md" \| "sm" \| "xl" \| "xs"` | `'md'`      |
| `src`    | `src`     | Image URL.                                                          | `string \| undefined`                  | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
