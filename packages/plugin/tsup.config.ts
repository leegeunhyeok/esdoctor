import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
  format: ['esm'],
  dts: true,
  external: ['@esdoctor/types'],
});
