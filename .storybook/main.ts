import type { StorybookConfig } from '@storybook/web-components-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|js|ts|mdx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  typescript: {
    check: false,
  },
  // Storybook 7 pins Vite 5, whose Sass integration still defaults to the
  // legacy, deprecated `sass.render()` API (the `[legacy-js-api]` warning
  // this silences) — Vite only switched the default to the modern API in
  // v6. The installed `sass` package is new enough to support it directly,
  // no `sass-embedded` needed.
  async viteFinal(config) {
    config.css ??= {};
    config.css.preprocessorOptions ??= {};
    config.css.preprocessorOptions.scss = {
      ...config.css.preprocessorOptions.scss,
      api: 'modern',
    };
    return config;
  },
};

export default config;
