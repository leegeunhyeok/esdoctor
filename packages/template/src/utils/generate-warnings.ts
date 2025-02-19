import type * as esbuild from 'esbuild';

export const generatedWarnings = generateWarnings(
  window.__esdoctorDataSource.metafile,
);

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
