import { performance } from 'node:perf_hooks';
import type { BuildOptions, BuildResult } from 'esbuild';
import { getEnvironment } from './get-environment.js';
import type { Environment, TraceResult } from './types.js';

export class PluginState {
  static extends(state: PluginState, result: BuildResult) {
    Object.assign(result, {
      environment: getEnvironment(),
      startedAt: state.startedAt,
      endedAt: state.endedAt,
      duration: state.endedAt - state.startedAt,
      traces: state.traceResult,
      initialOptions: state.initialOptions,
    });
  }

  environment: Environment;
  initialOptions?: BuildOptions;
  startedAt = 0;
  endedAt = 0;
  traceResult: TraceResult[] = [];

  constructor() {
    this.environment = getEnvironment();
  }

  reset() {
    this.startedAt = 0;
    this.endedAt = 0;
    this.traceResult = [];
    this.initialOptions = undefined;
  }

  start(initialOptions?: BuildOptions) {
    this.initialOptions = initialOptions;
    this.startedAt = new Date().getTime();
  }

  end() {
    this.endedAt = new Date().getTime();
  }

  withTrace<R = unknown, T = unknown>(
    action: () => R | Promise<R>,
    config: {
      name: string;
      data?: T;
    }
  ) {
    const originStack = new Error().stack;
    const start = performance.now();
    const perform = async () => {
      let hookedResult: R | undefined;
      try {
        return (hookedResult = await action());
      } catch (error) {
        originStack && (error.stack = originStack);
        throw error;
      } finally {
        const end = performance.now();
        this.traceResult.push({
          name: config.name,
          data: config.data,
          result: hookedResult,
          duration: end - start,
        });
      }
    };

    return { perform };
  }
}
