import type * as esbuild from 'esbuild';

export type BuildResult<
  ProvidedOptions extends esbuild.BuildOptions = esbuild.BuildOptions,
> = esbuild.BuildResult<ProvidedOptions> & {
  environment: Environment;
  startedAt: number;
  endedAt: number;
  duration: number;
  traces: TraceResult[];
  initialOptions: esbuild.BuildOptions | undefined;
};

export interface Environment {
  platform: NodeJS.Platform;
  arch: NodeJS.Architecture;
  cpu: Record<string, number>;
  cwd: string;
}

export interface TraceResult<T = unknown> {
  name: string;
  duration: number;
  data: unknown;
  result: T;
}
