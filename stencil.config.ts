import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';
import { postcss } from '@stencil/postcss';
import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'scarlet',
  globalStyle: 'src/global/scarlet.scss',
  plugins: [
    sass(),
    postcss({
      plugins: [autoprefixer()]
    })
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
    {
      type: 'dist-hydrate-script',
    },
  ],
  testing: {
    browserHeadless: 'new',
  },
  buildEs5: 'prod',
  extras: {
    experimentalImportInjection: true,
  },
};
