import { performance } from 'node:perf_hooks';
import type {
  HookTrace,
  Environment,
  Metafile,
  ModuleStatus,
  Duration,
} from '@esdoctor/types';
import type { BuildOptions, BuildResult } from 'esbuild';
import { getEnvironment } from './get-environment.js';
import { toNormalizedObject } from './utils/to-normalized-object.js';

interface PluginStateOptions {
  collectHooksData: boolean;
}

export class PluginState {
  static extend(state: PluginState, result: BuildResult) {
    if (result.metafile == null) {
      throw new Error('metafile is empty');
    }

    const moduleStatus = Object.values(result.metafile.inputs).reduce(
      (acc, { format, bytes }) => {
        switch (format) {
          case 'cjs':
            acc.cjs += bytes;
            break;
          case 'esm':
            acc.esm += bytes;
            break;
          default:
            acc.unknown += bytes;
            break;
        }
        return acc;
      },
      { cjs: 0, esm: 0, unknown: 0 } as ModuleStatus,
    );

    const hookDurations = state.traceList.reduce(
      (acc, trace) => ({
        ...acc,
        [trace.type]: (acc[trace.type] ?? 0) + trace.duration.total,
      }),
      {
        onStart: 0,
        onResolve: 0,
        onLoad: 0,
        onDispose: 0,
        onEnd: 0,
      } as Duration['hooks'],
    );

    const extendOptions: Metafile = {
      alerts: [
        ...result.warnings.map((message) => ({
          type: 'warning' as const,
          ...message,
        })),
        ...result.errors.map((message) => ({
          type: 'error' as const,
          ...message,
        })),
      ],
      traceList: state.traceList.map((trace) => ({
        ...trace,
        data: trace.data == null ? trace.data : toNormalizedObject(trace.data),
      })),
      metafile: result.metafile,
      environment: getEnvironment(),
      moduleStatus,
      buildOptions: toNormalizedObject(state.buildOptions ?? {}),
      duration: {
        total: state.endedAt - state.startedAt,
        hooks: hookDurations,
      },
    };

    Object.assign(result, extendOptions);
  }

  environment: Environment;
  buildOptions?: BuildOptions;
  startedAt = 0;
  endedAt = 0;
  traceList: HookTrace[] = [];

  constructor(private options: PluginStateOptions) {
    this.environment = getEnvironment();
  }

  reset() {
    this.startedAt = 0;
    this.endedAt = 0;
    this.traceList = [];
    this.buildOptions = undefined;
  }

  start(buildOptions?: BuildOptions) {
    this.buildOptions = buildOptions;
    this.startedAt = new Date().getTime();
  }

  end() {
    this.endedAt = new Date().getTime();
  }

  withTrace<
    R = unknown,
    T extends Record<string, unknown> = Record<string, unknown>,
  >(
    action: () => R | Promise<R>,
    config: {
      type: HookTrace['type'];
      name: string;
      data?: T;
    },
  ) {
    const originStack = new Error().stack;
    const start = performance.now();
    let end: number;

    const perform = async () => {
      let hookedResult: R | undefined;
      try {
        hookedResult = await action();
        end = performance.now();
        return hookedResult;
      } catch (error) {
        originStack && (error.stack = originStack);
        throw error;
      } finally {
        end ??= performance.now();
        this.traceList.push({
          type: config.type,
          name: config.name,
          duration: {
            total: end - start,
            start,
            end,
          },
          // Collect data only if the option is enabled
          data: this.options.collectHooksData ? config.data : undefined,
          code: this.options.collectHooksData
            ? (hookedResult as unknown as { contents?: string })?.contents
            : undefined,
        });
      }
    };

    return { perform };
  }
}
