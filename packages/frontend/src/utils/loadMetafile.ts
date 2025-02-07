import * as esbuild from 'esbuild';
import metafile from '../metafile.json';

// TODO: Get metafile from global
export function loadMetafile(): esbuild.Metafile {
  return metafile as esbuild.Metafile;
}
