import type { GroupedPaths } from '../components/file-tree';

export function createFileTreeData(paths: string[]): GroupedPaths {
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
