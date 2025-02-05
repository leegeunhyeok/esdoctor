import * as esbuild from 'esbuild';
import { describe, it, expect } from 'vitest';
import { BuildResult, create } from './index.js';

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

describe('esdoctor-plugin', () => {
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

  it('should extend esbuild result', async () => {
    const esdoctor = create();
    const result = await esbuild.build({
      ...getBaseBuildOptions(),
      plugins: [esdoctor.plugin, esdoctor.bind(TEMPLATE.fooResolver())],
    });

    expect('environment' in result).toBe(true);
    expect('startedAt' in result).toBe(true);
    expect('endedAt' in result).toBe(true);
    expect('duration' in result).toBe(true);
    expect('traces' in result).toBe(true);
    expect('initialOptions' in result).toBe(true);
  });

  describe('when build with bound plugins', () => {
    it('should trace the bound plugin', async () => {
      const esdoctor = create();
      const nonBoundPlugin = {
        name: 'non-bound-plugin',
        setup(build) {
          build.onStart(() => {});
          build.onEnd(() => {});
        },
      };

      const boundPlugin = {
        name: 'bound-plugin',
        setup(build) {
          build.onStart(() => {});
          build.onEnd(() => {});
        },
      };

      const result = (await esbuild.build({
        ...getBaseBuildOptions(),
        plugins: [
          esdoctor.plugin,
          TEMPLATE.fooResolver(),
          // non-bound plugin
          nonBoundPlugin,
          // bound plugin
          esdoctor.bind(boundPlugin),
        ],
      })) as BuildResult;

      const traceNames = result.traces.map((trace) => trace.name);
      const hasNonBoundPluginTrace = traceNames.some((name) =>
        name.includes('non-bound-plugin')
      );

      expect(hasNonBoundPluginTrace).toBe(false);
      expect(traceNames).toMatchInlineSnapshot(`
        [
          "bound-plugin@onStart",
          "bound-plugin@onEnd",
        ]
      `);
    });
  });

  describe('when `metafile` is disabled', () => {
    it('should throw an error', async () => {
      const esdoctor = create();

      expect(() =>
        esbuild.build({
          ...getBaseBuildOptions(),
          metafile: false,
          plugins: [esdoctor.plugin, esdoctor.bind(TEMPLATE.fooResolver())],
        })
      ).rejects.toThrowError();
    });
  });
});
