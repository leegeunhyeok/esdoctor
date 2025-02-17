import type { Plugin } from 'esbuild';
import { PluginState } from './state.js';

export interface PluginOptions {
  enabled?: boolean;
}

const DEFAULT_OPTIONS: PluginOptions = {
  enabled: true,
};

export function create(options: PluginOptions = DEFAULT_OPTIONS): {
  plugin: Plugin;
  trace: (plugin: Plugin) => Plugin;
} {
  const state = new PluginState();
  const plugin: Plugin = {
    name: 'esdoctor-plugin',
    setup(build) {
      if (!options.enabled) {
        return;
      }

      if (build.initialOptions?.metafile !== true) {
        throw new Error('enable `metafile` option to use the plugin');
      }

      build.onStart(() => {
        state.reset();
        state.start(build.initialOptions);
      });

      build.onEnd((result) => {
        state.end();
        PluginState.extend(state, result);
      });
    },
  };

  return {
    plugin,
    trace: options.enabled ? withTraceImpl.bind(state) : withTraceShim,
  };
}

function withTraceShim(plugin: Plugin): Plugin {
  return plugin;
}

function withTraceImpl(this: PluginState, plugin: Plugin): Plugin {
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
