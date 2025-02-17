import { Metafile } from '@esdoctor/types';
import type * as esbuild from 'esbuild';

export type BuildResult<
  ProvidedOptions extends esbuild.BuildOptions = esbuild.BuildOptions,
> = esbuild.BuildResult<ProvidedOptions> & Metafile;
