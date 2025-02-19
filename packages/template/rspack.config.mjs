import { readFile } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@rspack/cli';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import RefreshPlugin from '@rspack/plugin-react-refresh';
import { BUNDLE_NAME, HTML_TEMPLATE, OUTPUT_DIR } from './shared.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ['chrome >= 87', 'edge >= 88', 'firefox >= 78', 'safari >= 14'];

export default defineConfig({
  context: __dirname,
  entry: {
    main: './src/main.tsx',
  },
  output: {
    clean: true,
    filename: BUNDLE_NAME,
    path: join(__dirname, OUTPUT_DIR),
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 8080,
    hot: true,
    static: {
      directory: resolve(__dirname, 'dist'),
    },
  },
  resolve: {
    extensions: ['...', '.ts', '.tsx', '.jsx'],
    pnp: true,
    alias: {
      '@': resolve(__dirname),
    },
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        type: 'asset',
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: HTML_TEMPLATE,
      scriptLoading: 'blocking',
      inject: 'body',
      minify: !isDev,
    }),
    new rspack.DefinePlugin({
      'process.env.METAFILE': JSON.stringify(
        isDev ? await loadMetafile() : null,
      ),
    }),
    isDev ? new RefreshPlugin() : null,
    process.env.RSDOCTOR ? new RsdoctorRspackPlugin() : null,
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
  experiments: {
    css: true,
  },
});

function loadMetafile() {
  return readFile('./esdoctor.json', 'utf-8').catch((error) => {
    if (error.code === 'ENOENT') {
      console.error('Metafile is not found');
      console.error(
        'Please run `yarn workspace esdoctor run prepare` to generate the metafile',
      );
      process.exit(1);
    }
    throw error;
  });
}
