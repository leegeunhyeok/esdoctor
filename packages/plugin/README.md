# plugin

## Installation

```bash
# npm
npm install @esdoctor/plugin

# pnpm
pnpm add @esdoctor/plugin

# yarn
yarn add @esdoctor/plugin
```

## Usage

```ts
import { create } from '@esdoctor/plugin';

const esdoctor = create();

esbuild.build({
  /* Other options */
  plugins: [
    // The base plugin, which should be placed first in the array.
    esdoctor.plugin,
    // Bound: will be traced by esdoctor for analysis
    esdoctor.bind(traceablePlugin1),
    esdoctor.bind(traceablePlugin2),
    esdoctor.bind(traceablePlugin3),
    // Unbound: will not be traced (plain plugin)
    otherPlugin,
  ],
  // Should enable `metafile` option to get the analysis result
  metafile: true,
});
```

## API

### create

Create a plugin context.

```ts
// Signature

function create(options?: PluginOptions): {
  plugin: esbuild.Plugin;
  bind: (plugin: esbuild.Plugin) => esbuild.Plugin;
};

interface PluginOptions {
  enabled?: boolean;
}
```

**Parameters:**

- `options`: The options for the plugin.
  - `enabled`: Enable the esdoctor plugin. (default: `true`)

**Returns:**

- `{ plugin: esbuild.Plugin, bind: (plugin: esbuild.Plugin) => esbuild.Plugin }`: The plugin context.
  - `plugin`: The base plugin of esdoctor.
  - `bind(plugin)`: Returns an enhanced plugin so that it can be traced by esdoctor for analysis.
