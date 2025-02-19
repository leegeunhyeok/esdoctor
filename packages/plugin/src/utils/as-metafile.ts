import { BuildResult } from 'esbuild';
import * as esdoctor from '@esdoctor/types';

export function asMetafile(result: BuildResult): esdoctor.Metafile | null {
  const {
    alerts,
    buildOptions,
    duration,
    environment,
    metafile,
    moduleStatus,
    traceList,
  } = (result ?? {}) as unknown as esdoctor.Metafile;

  if (
    alerts &&
    buildOptions &&
    duration &&
    environment &&
    metafile &&
    moduleStatus &&
    traceList
  ) {
    return {
      alerts,
      buildOptions,
      duration,
      environment,
      metafile,
      moduleStatus,
      traceList,
    };
  }

  return null;
}
