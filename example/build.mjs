import { readFile, writeFile } from 'node:fs/promises';
import * as esbuild from 'esbuild';
import { setup, asMetafile } from '@esdoctor/plugin';

const result = await esbuild.build({
  entryPoints: ['./src/main.tsx'],
  bundle: true,
  metafile: true,
  outdir: 'dist',
  loader: {
    '.svg': 'text',
  },
  plugins: setup([
    {
      name: 'example-plugin',
      setup(build) {
        function delay(ms) {
          return new Promise((resolve) => {
            setTimeout(resolve, ms);
          });
        }

        build.onStart(() => delay(1));

        build.onResolve({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          if (args.pluginData?.resolving) {
            return;
          }

          const result = await build.resolve(args.path, {
            importer: args.importer,
            kind: args.kind,
            resolveDir: args.resolveDir,
            with: args.with,
            pluginData: {
              resolving: true,
            },
          });

          return result;
        });

        build.onLoad({ filter: /\.(?:[mc]js|[tj]sx?)$/ }, async (args) => {
          const data = await readFile(args.path, { encoding: 'utf-8' });

          return { contents: data, loader: args.path.split('.').pop() };
        });

        build.onEnd(() => delay(1));
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
