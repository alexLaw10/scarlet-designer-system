# scarlet-grid-item



<!-- Auto Generated Below -->


## Overview

A cell inside a `<scarlet-grid>` that can span multiple columns/rows.

`colSpan`/`rowSpan` can change per breakpoint via `colSpanSm`/`colSpanMd`/
`colSpanLg`/`colSpanXl` (and the `rowSpan` equivalents) — the classic "full
row on mobile, a couple columns on desktop" pattern is
`col-span="{columns}" col-span-md="2"`. Each one only takes effect from
its breakpoint up and, left unset, falls back to the next smaller
breakpoint that *is* set (mobile-first cascade, same as `<scarlet-grid>`'s
own `columns`/`columnsSm`/etc.), down to `colSpan`/`rowSpan` themselves.

## Properties

| Property    | Attribute     | Description                                                                                                               | Type                  | Default     |
| ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------- |
| `colSpan`   | `col-span`    | Number of columns this item spans below the `sm` breakpoint (or at every size, if no responsive override is set).         | `1`                   | `1`         |
| `colSpanLg` | `col-span-lg` | Column span from the `lg` breakpoint (1024px) up. Falls back to `colSpanMd`/`colSpanSm`/`colSpan` when unset.             | `number \| undefined` | `undefined` |
| `colSpanMd` | `col-span-md` | Column span from the `md` breakpoint (768px) up. Falls back to `colSpanSm`/`colSpan` when unset.                          | `number \| undefined` | `undefined` |
| `colSpanSm` | `col-span-sm` | Column span from the `sm` breakpoint (640px) up. Falls back to `colSpan` when unset.                                      | `number \| undefined` | `undefined` |
| `colSpanXl` | `col-span-xl` | Column span from the `xl` breakpoint (1280px) up. Falls back to `colSpanLg`/`colSpanMd`/`colSpanSm`/`colSpan` when unset. | `number \| undefined` | `undefined` |
| `rowSpan`   | `row-span`    | Number of rows this item spans below the `sm` breakpoint (or at every size, if no responsive override is set).            | `1`                   | `1`         |
| `rowSpanLg` | `row-span-lg` | Row span from the `lg` breakpoint (1024px) up. Falls back to `rowSpanMd`/`rowSpanSm`/`rowSpan` when unset.                | `number \| undefined` | `undefined` |
| `rowSpanMd` | `row-span-md` | Row span from the `md` breakpoint (768px) up. Falls back to `rowSpanSm`/`rowSpan` when unset.                             | `number \| undefined` | `undefined` |
| `rowSpanSm` | `row-span-sm` | Row span from the `sm` breakpoint (640px) up. Falls back to `rowSpan` when unset.                                         | `number \| undefined` | `undefined` |
| `rowSpanXl` | `row-span-xl` | Row span from the `xl` breakpoint (1280px) up. Falls back to `rowSpanLg`/`rowSpanMd`/`rowSpanSm`/`rowSpan` when unset.    | `number \| undefined` | `undefined` |


## Slots

| Slot | Description         |
| ---- | ------------------- |
|      | The cell's content. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
