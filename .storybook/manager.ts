import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

// Brand assets live as real files at .storybook/brand/ (version-controlled,
// easy to update) — inlined here as base64 data URIs so the manager UI
// doesn't need a static-file server config to find them.
const brandImage =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNjAwIDQwMCIgd2lkdGg9IjE2MDAiIGhlaWdodD0iNDAwIiByb2xlPSJpbWciIGFyaWEtbGFiZWw9IlNjYXJsbGV0Ij4KICA8dGl0bGU+U2NhcmxsZXQ8L3RpdGxlPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2OCwyMDApIHNjYWxlKDAuODYpIj4KICAgIDxnPgogICAgICA8cG9seWdvbiBwb2ludHM9IjAsLTExMiA5MCwwIDM2LDAgMCwtNDIiIGZpbGw9IiNlYzMwMTMiPjwvcG9seWdvbj4KICAgICAgPHBvbHlnb24gcG9pbnRzPSI5MCwwIDAsMTEyIDAsNDIgMzYsMCIgZmlsbD0iI2MxMjQwYyI+PC9wb2x5Z29uPgogICAgICA8cG9seWdvbiBwb2ludHM9IjAsMTEyIC05MCwwIC0zNiwwIDAsNDIiIGZpbGw9IiNmZjVhM2MiPjwvcG9seWdvbj4KICAgICAgPHBvbHlnb24gcG9pbnRzPSItOTAsMCAwLC0xMTIgMCwtNDIgLTM2LDAiIGZpbGw9IiM4ZjFhMDciPjwvcG9seWdvbj4KICAgICAgPHBvbHlnb24gcG9pbnRzPSIwLC00MiAzNiwwIDAsNDIgLTM2LDAiIGZpbGw9IiNmM2YyZjIiPjwvcG9seWdvbj4KICAgICAgPHBvbHlnb24gcG9pbnRzPSIwLC0xMTIgOTAsMCAwLDExMiAtOTAsMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjAxZTFkIiBzdHJva2Utd2lkdGg9IjQiPjwvcG9seWdvbj4KICAgIDwvZz48L2c+CgogICAgPHRleHQgeD0iMzAwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmNoaXZvLCAnQXJjaGl2bycsIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTk2IiBmb250LXdlaWdodD0iODAwIiBsZXR0ZXItc3BhY2luZz0iMTQiIGZpbGw9IiMyMDFlMWQiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj5TQ0FSTExFVDwvdGV4dD4KPC9zdmc+';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Scarlet Design System',
    brandUrl: '/',
    brandImage,
    brandTarget: '_self',

    colorPrimary: '#ec3013',
    colorSecondary: '#ec3013',
  }),
});
