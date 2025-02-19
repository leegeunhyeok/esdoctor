import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  shims: true,
  platform: 'node',
  external: ['linkedom'],
});
