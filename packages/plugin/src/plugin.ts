import type { Plugin, PluginBuild } from 'esbuild';
import { PluginState } from './state.js';

export interface PluginOptions {
  enabled?: boolean;
}

const DEFAULT_OPTIONS: PluginOptions = {
  enabled: true,
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

function create(_options: PluginOptions): {
  startMarker: Plugin;
  endMarker: Plugin;
  trace: (plugin: Plugin) => Plugin;
} {
  const state = new PluginState();

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
          }).perform(),
        );
      },
      onResolve: (options, callback) => {
        build.onResolve(options, (result) =>
          this.withTrace(() => callback(result), {
            type: 'onResolve',
            name,
            data: {
              options,
              args: result,
            },
          }).perform(),
        );
      },
      onLoad: (options, callback) => {
        build.onLoad(options, (result) =>
          this.withTrace(() => callback(result), {
            type: 'onLoad',
            name,
            data: {
              options,
              args: result,
            },
          }).perform(),
        );
      },
      onDispose: (callback) => {
        build.onDispose(() =>
          this.withTrace(() => callback(), {
            type: 'onDispose',
            name,
          }).perform(),
        );
      },
      onEnd: (callback) => {
        build.onEnd((result) =>
          this.withTrace(() => callback(result), {
            type: 'onEnd',
            name,
          }).perform(),
        );
      },
    });
  };

  return { name, setup };
}
