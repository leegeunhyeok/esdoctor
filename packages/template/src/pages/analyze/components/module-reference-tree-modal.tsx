import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { bytesToText } from '@/src/utils/filesize';
import type { ModuleTreeItem } from '@/src/utils/resolve-module-tree';
import { CornerLeftDown, File } from 'lucide-react';

export interface ModuleReferenceTreeModalProps {
  open: boolean;
  module: {
    path: string;
    originSize: number;
    bundledSize: number;
  };
  referenceStack: ModuleTreeItem[];
  onOpenChange: (open: boolean) => void;
}

export function ModuleReferenceTreeModal({
  open,
  module,
  referenceStack,
  onOpenChange,
}: ModuleReferenceTreeModalProps) {
  const { treeShakable, nonTreeShakable } = toTreeShakableGroup(referenceStack);

  const renderModuleItem = (item: ModuleTreeItem) => {
    return (
      <div key={item.path} className="flex flex-row items-center gap-2 text-sm">
        <CornerLeftDown size={16} className="mt-2" />
        {renderModuleOriginal(item)}
        <p className="text-muted-foreground text-xs">(From: {item.path})</p>
      </div>
    );
  };

  const renderModuleOriginal = (item: ModuleTreeItem) => {
    switch (item.referenceType) {
      case 'dynamic-import':
        return <code>import('{item.original}')</code>;

      case 'import-statement':
        return <code>import '{item.original}'</code>;

      case 'require-call':
        return <code>require('{item.original}')</code>;

      default:
        return null;
    }
  };

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid max-h-[70vh] w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 overflow-y-auto border p-6 shadow-lg duration-200 sm:max-w-[700px] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Module reference stack</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {treeShakable.length ? (
            <div className="flex flex-col gap-1 rounded-md bg-blue-100 p-2">
              <p className="text-xs text-blue-500">Tree shakable</p>
              {treeShakable.map(renderModuleItem)}
            </div>
          ) : null}
          {nonTreeShakable.length ? (
            <div className="flex flex-col gap-1 rounded-md bg-red-100 p-2">
              <p className="text-xs text-red-500">Non-tree shakable</p>
              {nonTreeShakable.map(renderModuleItem)}
            </div>
          ) : null}
          <div className="flex flex-col gap-2 rounded-md border p-2">
            <div className="flex flex-row items-center gap-2">
              <File size={16} />
              {module.path}
            </div>
            <div className="flex flex-col">
              <p>Bundled size: {bytesToText(module.bundledSize)}</p>
              <p>Original size: {bytesToText(module.originSize)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const toTreeShakableGroup = (moduleTree: ModuleTreeItem[]) => {
  let lastTreeShakableIndex = -1;
  let treeShakable = false;

  for (let i = 0; i < moduleTree.length; i++) {
    treeShakable = false;

    switch (moduleTree[i].referenceType) {
      case 'dynamic-import':
      case 'import-statement':
        treeShakable = true;
        lastTreeShakableIndex = i;
        break;
    }

    if (treeShakable === false) {
      break;
    }
  }

  lastTreeShakableIndex += 1;

  return {
    treeShakable: moduleTree.slice(0, lastTreeShakableIndex),
    nonTreeShakable: moduleTree.slice(lastTreeShakableIndex),
  };
};
