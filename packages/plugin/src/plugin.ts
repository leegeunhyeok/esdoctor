import type { Plugin, PluginBuild } from 'esbuild';
import { PluginState } from './state.js';

export interface PluginOptions {
  /**
   * Whether to enable the plugin.
   *
   * @default true
   */
  enabled?: boolean;
  /**
   * Whether to collect data(args, contents, etc.) from the esbuild plugin hooks.
   *
   * @default true
   */
  collectHooksData?: boolean;
}

const DEFAULT_OPTIONS: PluginOptions = {
  enabled: true,
  collectHooksData: true,
};

export function setup(
  plugins: Plugin[],
  options: PluginOptions = DEFAULT_OPTIONS,
) {
  if (!options?.enabled) {
    return plugins;
  }

  const context = create(options);

  return [
    context.startMarker,
    ...plugins.map((plugin) => context.trace(plugin)),
    context.endMarker,
  ];
}

function create(options: PluginOptions): {
  startMarker: Plugin;
  endMarker: Plugin;
  trace: (plugin: Plugin) => Plugin;
} {
  const state = new PluginState({
    collectHooksData: options.collectHooksData ?? true,
  });

  function assertMetafileOption(build: PluginBuild) {
    if (build.initialOptions?.metafile !== true) {
      throw new Error('enable `metafile` option to use the plugin');
    }
  }

  const startMarker: Plugin = {
    name: 'esdoctor-plugin:start-marker',
    setup(build) {
      assertMetafileOption(build);

      build.onStart(() => {
        state.reset();
        state.start(build.initialOptions);
      });
    },
  };

  const endMarker: Plugin = {
    name: 'esdoctor-plugin:end-marker',
    setup(build) {
      assertMetafileOption(build);

      build.onEnd((result) => {
        state.end();
        PluginState.extend(state, result);
      });
    },
  };

  return {
    startMarker,
    endMarker,
    trace: withTrace.bind(state),
  };
}

function withTrace(this: PluginState, plugin: Plugin): Plugin {
  const name = plugin.name;

  const setup: Plugin['setup'] = (build) => {
    return plugin.setup?.({
      ...build,
      onStart: (callback) => {
        build.onStart(() =>
          this.withTrace(() => callback(), {
            type: 'onStart',
            name,
            args: null,
            options: null,
          }).perform(),
        );
      },
      onResolve: (options, callback) => {
        build.onResolve(options, (args) =>
          this.withTrace(() => callback(args), {
            type: 'onResolve',
            name,
            options,
            args,
          }).perform(),
        );
      },
      onLoad: (options, callback) => {
        build.onLoad(options, (args) =>
          this.withTrace(() => callback(args), {
            type: 'onLoad',
            name,
            options,
            args,
          }).perform(),
        );
      },
      onDispose: (callback) => {
        build.onDispose(() =>
          this.withTrace(() => callback(), {
            type: 'onDispose',
            name,
            args: null,
            options: null,
          }).perform(),
        );
      },
      onEnd: (callback) => {
        build.onEnd((result) =>
          this.withTrace(() => callback(result), {
            type: 'onEnd',
            name,
            args: null,
            options: null,
          }).perform(),
        );
      },
    });
  };

  return { name, setup };
}
