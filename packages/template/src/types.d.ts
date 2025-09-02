import type { Metafile, HookTrace } from '@esdoctor/types';
import type * as esbuild from 'esbuild';
import type { TimelineData } from './pages/timeline/types';

declare global {
  interface Window {
    __esdoctorDataSource: Metafile & {
      processed: {
        moduleCount: number;
        totalSize: number;
        totalModulesSize: number;
        timelineData: {
          timelineData: TimelineData[];
          traceNames: string[];
          traceNameIndexMap: Record<string, number>;
          min: number;
          max: number;
        };
        warnings: string[];
        moduleTree: Record<
          string,
          Array<{
            path: string;
            original: string | undefined;
            referenceType: esbuild.ImportKind;
          }>
        >;
        fileTree: (string | (string | GroupedPaths)[])[];
      };
    };
  }
}
