import * as esbuild from 'esbuild';
import { describe, it, expect } from 'vitest';
import { asMetafile, BuildResult, setup } from './index.js';
import assert from 'node:assert';

const TEMPLATE = {
  entryScript: `import { foo } from './foo';`,
  fooResolver: () => ({
    name: 'foo-plugin',
    setup(build) {
      build.onResolve({ filter: /\.\/foo/ }, () => {
        return { path: '@foo', namespace: 'foo' };
      });

      build.onLoad({ filter: /.*/, namespace: 'foo' }, () => ({
        contents: `export const foo = ${new Date().getTime()};`,
      }));
    },
  }),
};

describe('@esdoctor/plugin', () => {
  function getBaseBuildOptions(): esbuild.BuildOptions {
    return {
      stdin: { contents: TEMPLATE.entryScript },
      bundle: true,
      metafile: true,
      treeShaking: false,
      write: false,
      logLevel: 'silent',
    };
  }

  describe('when enabled', () => {
    it('should extend esbuild result', async () => {
      const result = await esbuild.build({
        ...getBaseBuildOptions(),
        plugins: setup([TEMPLATE.fooResolver()]),
      });

      expect('alerts' in result).toBe(true);
      expect('traceList' in result).toBe(true);
      expect('environment' in result).toBe(true);
      expect('moduleStatus' in result).toBe(true);
      expect('buildOptions' in result).toBe(true);
      expect('duration' in result).toBe(true);
    });

    describe('when `metafile` is enabled', () => {
      it('should not throw an error', async () => {
        await expect(
          esbuild.build({
            ...getBaseBuildOptions(),
            metafile: true,
            plugins: setup([TEMPLATE.fooResolver()]),
          }),
        ).resolves.toBeDefined();
      });
    });

    describe('when `metafile` is disabled', () => {
      it('should throw an error', async () => {
        await expect(() =>
          esbuild.build({
            ...getBaseBuildOptions(),
            metafile: false,
            plugins: setup([TEMPLATE.fooResolver()]),
          }),
        ).rejects.toThrowError();
      });
    });

    describe('when build with bound plugins', () => {
      it('should trace the bound plugin', async () => {
        const plugin1 = {
          name: 'plugin-1',
          setup(build) {
            build.onStart(() => {});
            build.onEnd(() => {});
          },
        };

        const plugin2 = {
          name: 'plugin-2',
          setup(build) {
            build.onStart(() => {});
            build.onEnd(() => {});
          },
        };

        const result = await esbuild.build({
          ...getBaseBuildOptions(),
          plugins: setup([TEMPLATE.fooResolver(), plugin1, plugin2]),
        });

        const metafile = asMetafile(result);
        assert(metafile, 'invalid esdoctor metafile');

        const traceNames = metafile.traceList.map((trace) => trace.name);
        const hasPlugin1Trace = traceNames.some((name) =>
          name.includes('plugin-1'),
        );
        const hasPlugin2Trace = traceNames.some((name) =>
          name.includes('plugin-2'),
        );

        expect(hasPlugin1Trace).toBe(true);
        expect(hasPlugin2Trace).toBe(true);
        expect(traceNames).toMatchInlineSnapshot(`
          [
            "plugin-1",
            "plugin-2",
            "foo-plugin",
            "foo-plugin",
            "plugin-1",
            "plugin-2",
          ]
        `);
      });
    });
  });

  describe('when disabled', () => {
    it('should not extend esbuild result', async () => {
      const result = await esbuild.build({
        ...getBaseBuildOptions(),
        plugins: setup([TEMPLATE.fooResolver()], { enabled: false }),
      });

      expect(asMetafile(result)).toBeNull();
    });

    describe('when `metafile` is disabled', () => {
      it('should not throw', async () => {
        await expect(
          esbuild.build({
            ...getBaseBuildOptions(),
            metafile: false,
            plugins: setup([TEMPLATE.fooResolver()], { enabled: false }),
          }),
        ).resolves.toBeDefined();
      });
    });
  });
});
