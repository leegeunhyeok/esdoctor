# @esdoctor/plugin

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
import * as esdoctor from '@esdoctor/plugin';

esbuild.build({
  /* Other options */
  plugins: esdoctor.setup([plugin1, plugin2, plugin3], options),
  // Should enable `metafile` option to get the analysis result
  metafile: true,
});
```

## API

### setup

Setup the esdoctor plugin.

```ts
// Signature

function setup(
  plugins: esbuild.Plugin[],
  options?: PluginOptions,
): esbuild.Plugin[];

interface PluginOptions {
  enabled?: boolean;
}
```

**Parameters:**

- `options`: The options for the plugin.
  - `enabled`: Enable the esdoctor plugin. (default: `true`)

## License

[MIT](./LICENSE)
