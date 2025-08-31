
import fs from 'node:fs/promises';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

const isDev = process.env.NODE_ENV === 'development';


function loadMetafile() {
  return fs.readFile('./esdoctor.json', 'utf-8').catch((error) => {
    if (error.code === 'ENOENT') {
      console.error('Metafile is not found');
      console.error(
        'Please run `yarn workspace esdoctor run prepare` to generate the metafile',
      );
      process.exit(1);
    }
    throw error;
  });
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    rolldownOptions: {
      input: './src/main.tsx',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve('.'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env.METAFILE': JSON.stringify(
      isDev ? await loadMetafile() : null,
    ),
  },
  plugins: [react(), tailwindcss()],
});
