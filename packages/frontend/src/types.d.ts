import type { Metafile } from '@esdoctor/types';

declare global {
  interface Window {
    $$dataSource: Metafile;
  }
}
