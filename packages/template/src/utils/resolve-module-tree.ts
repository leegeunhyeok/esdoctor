import type * as esbuild from 'esbuild';

export interface ModuleTreeItem {
  path: string;
  original: string | undefined;
  referenceType: esbuild.ImportKind;
}

export function resolveModuleTree(modulePath: string) {
  return window.__esdoctorDataSource.processed.moduleTree[modulePath] || [];
}
