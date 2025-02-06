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
  bind: (plugin: Plugin) => Plugin;
} {
  const state = new PluginState();
  const plugin: Plugin = {
    name: 'esdoctor-plugin',
    setup(build) {
      if (!options.enabled) {
        return;
      }

      if (!build.initialOptions?.metafile) {
        throw new Error('enable `metafile` option to use the plugin');
      }

      build.onStart(() => {
        state.reset();
        state.start(build.initialOptions);
      });

      build.onEnd((result) => {
        state.end();
        PluginState.extends(state, result);
      });
    },
  };

  return {
    plugin,
    bind: options.enabled ? bindPlugin.bind(state) : (plugin) => plugin,
  };
}

function bindPlugin(this: PluginState, plugin: Plugin): Plugin {
  const name = plugin.name;
  const setup: Plugin['setup'] = (build) => {
    return plugin.setup?.({
      ...build,
      onStart: (callback) => {
        const traceName = `${name}@onStart`;

        build.onStart(() =>
          this.withTrace(() => callback(), {
            name: traceName,
          }).perform(),
        );
      },
      onResolve: (options, callback) => {
        const traceName = `${name}@onResolve`;
        const traceData = { options };

        build.onResolve(options, (result) =>
          this.withTrace(() => callback(result), {
            name: traceName,
            data: traceData,
          }).perform(),
        );
      },
      onLoad: (options, callback) => {
        const traceName = `${name}@onLoad`;
        const traceData = { options };

        build.onLoad(options, (result) =>
          this.withTrace(() => callback(result), {
            name: traceName,
            data: traceData,
          }).perform(),
        );
      },
      onDispose: (callback) => {
        const traceName = `${name}@onDispose`;

        build.onDispose(() =>
          this.withTrace(() => callback(), { name: traceName }).perform(),
        );
      },
      onEnd: (callback) => {
        const traceName = `${name}@onEnd`;

        build.onEnd((result) =>
          this.withTrace(() => callback(result), {
            name: traceName,
          }).perform(),
        );
      },
    });
  };

  return { name, setup };
}
