import type { Preview } from '@storybook/web-components';
import '../src/global/scarlet.scss';
// Registers every <scarlet-*> custom element with the browser. Without this,
// stories render the tags as plain, unstyled, undefined elements (just their
// slotted text, no shadow DOM) — nothing else in the Storybook setup does
// this registration. Requires a prior `npm run build` (this imports the
// compiled ../loader output, not the .tsx sources).
import { defineCustomElements } from '../loader';

defineCustomElements();

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
