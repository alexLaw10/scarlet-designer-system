# scarlet-breadcrumb



<!-- Auto Generated Below -->


## Overview

A trail of links showing the current page's position in a hierarchy,
following the WAI-ARIA breadcrumb pattern (`<nav aria-label>` wrapping an
ordered list, the last item marked `aria-current="page"`).

Items render as real `<a href>` elements — usable with no JS at all — but
every click first emits a cancelable `scarletNavigate`, so a framework
router can call `preventDefault()` and handle the navigation itself
instead of a full page load.

## Properties

| Property    | Attribute    | Description                                                                                                                | Type                      | Default                  |
| ----------- | ------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------------ |
| `ariaLabel` | `aria-label` | Accessible label for the `<nav>` landmark.                                                                                 | `"Navegação estrutural"`  | `'Navegação estrutural'` |
| `items`     | --           | The trail of items, in order from the root down to the current page.                                                       | `ScarletBreadcrumbItem[]` | `[]`                     |
| `separator` | `separator`  | Text rendered between items. Purely decorative (hidden from assistive tech) — the DOM order already conveys the hierarchy. | `"›"`                     | `'›'`                    |


## Events

| Event             | Description                                                                                                                                                                                                                                    | Type                                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `scarletNavigate` | Emitted when a link item is clicked, before the browser navigates. Cancelable: call `event.preventDefault()` (on the emitted `CustomEvent`, not the click) to stop the real navigation and handle it yourself, e.g. with a client-side router. | `CustomEvent<ScarletBreadcrumbItem>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
