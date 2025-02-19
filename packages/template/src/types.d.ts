import type { Metafile } from '@esdoctor/types';

declare global {
  interface Window {
    __esdoctorDataSource: Metafile;
  }
}
