import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: false,
  external: ['yargs'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
