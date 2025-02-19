import type * as esbuild from 'esbuild';
const metafile = window.$$dataSource.metafile;

export interface ModuleTreeItem {
  path: string;
  original: string | undefined;
  referenceType: esbuild.ImportKind;
}

export function resolveModuleTree(modulePath: string) {
  const tree: ModuleTreeItem[] = [];
  const modules = Object.entries(metafile.inputs);
  const visited = new Set<string>();
  let currentModulePath = modulePath;
  let found = false;

  while (currentModulePath) {
    found = false;

    for (const module of modules) {
      const [modulePath, meta] = module;
      const moduleReference = meta.imports.find(
        (moduleImport) => moduleImport.path === currentModulePath,
      );

      if (visited.has(modulePath)) {
        continue;
      }

      if (moduleReference != null) {
        tree.push({
          path: modulePath,
          original: moduleReference.original,
          referenceType: moduleReference.kind,
        });

        visited.add(modulePath);
        currentModulePath = modulePath;
        found = true;
        break;
      }
    }

    if (found === false) {
      break;
    }
  }

  return tree.reverse();
}
