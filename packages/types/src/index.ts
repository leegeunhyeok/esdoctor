import type * as esbuild from 'esbuild';

export interface Metafile {
  metafile: esbuild.Metafile;
  alerts: (esbuild.Message & { type: 'error' | 'warning' })[];
  traceList: HookTrace[];
  environment: Environment;
  moduleStatus: ModuleStatus;
  buildOptions: esbuild.BuildOptions;
  duration: Duration;
}

export interface Environment {
  /**
   * Platform
   */
  platform: string;
  /**
   * Architecture
   */
  arch: string;
  /**
   * CPU name
   */
  cpu: Record<string, number>;
  /**
   * Current working directory
   */
  cwd: string;
}

export interface Duration {
  /**
   * Total duration
   */
  total: number;
  /**
   * Hook durations
   */
  hooks: {
    onStart: number;
    onResolve: number;
    onLoad: number;
    onDispose: number;
    onEnd: number;
  };
}

export interface ModuleStatus {
  /**
   * CommonJS modules
   */
  cjs: number;
  /**
   * ES modules
   */
  esm: number;
  /**
   * Unknown modules
   */
  unknown: number;
}

export interface HookTrace {
  /**
   * Plugin name
   */
  name: string;
  /**
   * Plugin hook type
   */
  type: 'onStart' | 'onResolve' | 'onLoad' | 'onDispose' | 'onEnd';
  /**
   * Hook result (code)
   */
  code?: string;
  /**
   * Hook duration
   */
  duration: {
    start: number;
    end: number;
    total: number;
  };
  /**
   * Additional hook data
   */
  data: Nullable<Record<string, unknown>>;
  /**
   * Hook result
   */
  result: Nullable<
    | esbuild.OnStartResult
    | esbuild.OnResolveResult
    | esbuild.OnLoadResult
    | esbuild.OnEndResult
  >;
}

type Nullable<T> = T | null | undefined;
