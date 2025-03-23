import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CornerDownRight, Network } from 'lucide-react';
import { FileTree } from './file-tree';
import { useState } from 'react';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { bytesToText } from '@/src/utils/filesize';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Metafile } from '@esdoctor/types';
import { createFileTreeData } from '../helpers/create-file-tree-data';

const data = createFileTreeData(
  Object.keys(window.__esdoctorDataSource.metafile.inputs),
);

export function DependencyTreeView() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const renderContent = () => {
    const module = selectedFile
      ? window.__esdoctorDataSource.metafile.inputs[selectedFile]
      : null;

    if (module) {
      return (
        <div className="flex h-full flex-col gap-2 p-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-lg font-semibold">Discover module</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              Dismiss
            </Button>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <p>{selectedFile}</p>
            {module.format != null ? (
              <Badge
                variant="outline"
                className={cn(
                  module.format === 'esm'
                    ? 'border-blue-300 bg-blue-100 text-blue-500'
                    : 'border-yellow-300 bg-yellow-100 text-yellow-500',
                )}
              >
                {module.format.toUpperCase()}
              </Badge>
            ) : null}
            <Badge
              variant="outline"
              className="border-gray-300 bg-gray-100 text-gray-500"
            >
              {bytesToText(module.bytes)}
            </Badge>
          </div>
          {renderDependencies(module.imports)}
        </div>
      );
    } else {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Select a file to discover its dependencies.
          </p>
        </div>
      );
    }
  };

  const renderDependencies = (
    imports: Metafile['metafile']['inputs'][string]['imports'],
  ) => {
    function DependencyRow({ index, style, data }) {
      const value = data[index];
      const module = window.__esdoctorDataSource.metafile.inputs[value.path];

      return (
        <Tooltip key={value.path}>
          <TooltipTrigger asChild>
            <div
              style={style}
              className="hover:bg-muted/50 text-muted-foreground flex cursor-pointer items-center gap-2 rounded-md px-2 py-1"
              onClick={() => setSelectedFile(value.path)}
            >
              <CornerDownRight size={16} />
              <p className="text-sm">{value.original ?? value.path}</p>
              {module?.format ? (
                <Badge
                  variant="outline"
                  className={cn(
                    module.format === 'esm'
                      ? 'border-blue-300 bg-blue-100 text-blue-500'
                      : 'border-yellow-300 bg-yellow-100 text-yellow-500',
                  )}
                >
                  {module.format.toUpperCase()}
                </Badge>
              ) : null}
              {module?.bytes != null ? (
                <Badge
                  variant="outline"
                  className="border-gray-300 bg-gray-100 text-gray-500"
                >
                  {bytesToText(module.bytes)}
                </Badge>
              ) : null}
            </div>
          </TooltipTrigger>
          <TooltipContent>{value.path}</TooltipContent>
        </Tooltip>
      );
    }

    return imports.length === 0 ? (
      <div className="text-muted-foreground text-sm">
        No dependencies found.
      </div>
    ) : (
      <div className="gap- flex h-full flex-col">
        <AutoSizer>
          {({ width, height }) => (
            <FixedSizeList
              itemData={imports}
              itemSize={30}
              width={width}
              height={height}
              itemCount={imports.length}
            >
              {DependencyRow}
            </FixedSizeList>
          )}
        </AutoSizer>
      </div>
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Network />
          Dependency Explorer
        </Button>
      </SheetTrigger>
      <SheetContent className="max-w-[100%] gap-0 sm:max-w-[850px]">
        <SheetHeader>
          <SheetTitle>Dependency Explorer</SheetTitle>
          <SheetDescription>
            Explore the dependencies of your project.
          </SheetDescription>
        </SheetHeader>
        <TooltipProvider>
          <div className="border-border flex h-full border-t">
            <div className="border-border h-full w-[280px] overflow-auto border-r pr-2">
              <FileTree
                data={data}
                focus={selectedFile}
                onFileClick={setSelectedFile}
              />
            </div>
            <div className="h-full w-full overflow-auto p-2">
              {renderContent()}
            </div>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
