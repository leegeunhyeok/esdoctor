import type * as esdoctor from '@esdoctor/types';
import type * as esbuild from 'esbuild';

export function createDataSource({
  metafile,
  ...esdoctorMetafile
}: esdoctor.Metafile) {
  const processedData = {
    ...esdoctorMetafile,
    metafile,
    processed: {
      moduleCount: Object.keys(metafile.inputs).length,
      totalSize: Object.values(metafile.outputs).reduce(
        (acc, output) => acc + output.bytes,
        0,
      ),
      totalModulesSize: Object.values(esdoctorMetafile.moduleStatus).reduce(
        (prev, value) => prev + value,
        0,
      ),
      timelineData: createTimelineData(esdoctorMetafile.traceList),
      warnings: generateWarnings(metafile),
      moduleTree: precomputeModuleTree(metafile),
      fileTree: precomputeFileTree(metafile),
    },
  };
  return JSON.stringify(processedData);
}

function createTimelineData(traceList: esdoctor.HookTrace[]) {
  let startTimestamp = Number.MAX_SAFE_INTEGER;
  let lastTimestamp = 0;

  const labelNames: string[] = [];
  const timelineData = traceList.map((trace) => {
    const label = `${trace.name}:${trace.type}`;

    startTimestamp = Math.min(startTimestamp, trace.duration.start);
    lastTimestamp = Math.max(lastTimestamp, trace.duration.end);
    labelNames.push(label);

    return {
      label,
      name: trace.name,
      type: trace.type,
      start: trace.duration.start,
      end: trace.duration.end,
      duration: trace.duration.end - trace.duration.start,
      options: trace.options,
      args: trace.args,
      result: trace.result,
      data: trace.data,
    };
  });

  const traceNames = Array.from(
    new Set(labelNames.sort((a, b) => (a > b ? -1 : 1))),
  );

  const traceNameIndexMap = Object.fromEntries(
    traceNames.map((name, index) => [name, index]),
  );

  return {
    timelineData: timelineData
      .sort((a, b) => a.start - b.start)
      .map((item) => ({
        ...item,
        start: item.start - startTimestamp,
        end: item.end - startTimestamp,
      })),
    traceNames,
    traceNameIndexMap,
    min: 0,
    max: lastTimestamp - startTimestamp,
  };
}

function generateWarnings(metafile: esbuild.Metafile): string[] {
  const inputs = metafile.inputs;
  const resolvedPaths: Record<string, string[]> = {};

  for (let i in inputs) {
    const input = inputs[i];
    for (const record of input.imports) {
      if (record.original && record.original[0] !== '.') {
        const array =
          resolvedPaths[record.original] ||
          (resolvedPaths[record.original] = []);
        if (!array.includes(record.path)) array.push(record.path);
      }
    }
  }

  const warnings: string[] = [];
  for (const original in resolvedPaths) {
    const paths = resolvedPaths[original];

    if (paths.length > 1) {
      warnings.push(toWarningMessage(original, paths));
    }
  }

  return warnings;
}

function toWarningMessage(original: string, paths: string[]) {
  return [
    `The import path '${original}' resolves to multiple files in the bundle:`,
    ...paths,
  ].join('\n');
}

function precomputeModuleTree(metafile: esbuild.Metafile) {
  const modules = Object.entries(metafile.inputs);
  const treeCache: Record<
    string,
    Array<{
      path: string;
      original: string | undefined;
      referenceType: esbuild.ImportKind;
    }>
  > = {};

  // Pre-compute trees for all modules
  for (const [modulePath] of modules) {
    treeCache[modulePath] = resolveModuleTree(modulePath, modules);
  }

  return treeCache;
}

function resolveModuleTree(
  modulePath: string,
  modules: Array<[string, esbuild.Metafile['inputs'][string]]>,
) {
  const tree: Array<{
    path: string;
    original: string | undefined;
    referenceType: esbuild.ImportKind;
  }> = [];
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

function precomputeFileTree(metafile: esbuild.Metafile) {
  type GroupedPaths = (string | (string | GroupedPaths)[])[];

  function createFileTreeData(paths: string[]): GroupedPaths {
    const result: GroupedPaths = [];

    const addPathToGroup = (
      group: GroupedPaths,
      pathParts: string[],
      fullPath: string,
    ) => {
      if (pathParts.length === 0) return;

      const [first, ...parts] = pathParts;
      let existingGroup = group.find(
        (item) => Array.isArray(item) && (item as string[])[0] === first,
      );

      if (!existingGroup) {
        existingGroup = [first];
        group.push(existingGroup);
      }

      if (parts.length === 0) {
        existingGroup = [fullPath];
      } else {
        addPathToGroup(existingGroup as GroupedPaths, parts, fullPath);
      }
    };

    for (const path of paths) {
      const pathParts = path.split('/').filter(Boolean); // '/'로 나누고 빈 문자열 제거
      addPathToGroup(result, pathParts, path);
    }

    return result;
  }

  return createFileTreeData(Object.keys(metafile.inputs));
}
