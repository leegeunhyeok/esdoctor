import * as esdoctor from '@esdoctor/types';
import { BuildResult } from '../types.js';

export function asMetafile(result: BuildResult): esdoctor.Metafile | null {
  const {
    alerts,
    buildOptions,
    duration,
    environment,
    metafile,
    moduleStatus,
    traceList,
  } = result;

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
