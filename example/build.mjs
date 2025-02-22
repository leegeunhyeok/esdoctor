import { readFile, writeFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';
import { setup, asMetafile } from '@esdoctor/plugin';
import * as swc from '@swc/core';
import * as svgr from '@svgr/core';
import path from 'node:path';

const result = await esbuild.build({
  entryPoints: ['./src/main.tsx'],
  bundle: true,
  metafile: true,
  outdir: 'dist',
  tsconfig: './tsconfig.app.json',
  plugins: setup([
    {
      name: 'example-status-plugin',
      setup(build) {
        build.onStart(() => console.log('Build start'));
        // build.onResolve({ filter: /.*/ }, (args) => {
        //   console.log('Lookup module:', args.importer, '->', args.path);
        //   return null;
        // });
        build.onLoad({ filter: /.*/ }, (args) => {
          console.log('Module loaded:', args.path);
          return null;
        });
        build.onEnd(() => console.log('Build end'));
      },
    },
    {
      name: 'example-transform-plugin',
      setup(build) {
        function delay(ms) {
          return new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
        }

        build.onStart(() => delay(50));

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          const rawCode = await readFile(args.path, { encoding: 'utf-8' });
          const basename = path.basename(args.path);
          const extname = path.extname(args.path);

          const parserConfig = (() => {
            switch (extname) {
              case '.ts':
              case '.mts':
              case '.tsx':
                return { syntax: 'typescript', tsx: true };

              case '.js':
              case '.mjs':
              case '.cjs':
              case '.jsx':
                return { syntax: 'ecmascript', jsx: true };

              default:
                throw new Error(`Unsupported file extension: ${extname}`);
            }
          })();

          const result = await swc.transform(rawCode, {
            filename: basename,
            jsc: {
              parser: parserConfig,
              target: 'es5',
              transform: {
                react: {
                  runtime: 'automatic',
                },
              },
            },
            module: {
              type: 'es6',
            },
            isModule: true,
          });

          return { contents: result.code, loader: 'js' };
        });

        build.onEnd(() => delay(50));
      },
    },
    {
      name: 'example-svg-transform-plugin',
      setup(build) {
        build.onLoad({ filter: /\.svg$/ }, async (args) => {
          const rawSvg = await readFile(args.path, { encoding: 'utf-8' });
          const code = await svgr.transform(rawSvg, { namedExport: 'default' });

          return { contents: code, loader: 'jsx' };
        });
      },
    },
  ]),
});

const esdoctorMetafile = asMetafile(result);

// Write esbuild's metafile
await writeFile('metafile.json', JSON.stringify(result.metafile), {
  encoding: 'utf-8',
});

// Write ESDoctor's metafile
await (esdoctorMetafile &&
  writeFile('esdoctor.json', JSON.stringify(esdoctorMetafile), {
    encoding: 'utf-8',
  }));
