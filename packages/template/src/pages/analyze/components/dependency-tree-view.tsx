import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { CornerDownRight, Network, X } from 'lucide-react';
import { FileTree } from './file-tree';
import { useMemo, useState } from 'react';
import { List, type RowComponentProps } from 'react-window';
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
import { formatInteger } from '@/src/utils/format';

type MetafileImports = Metafile['metafile']['inputs'][string]['imports'];

const data = createFileTreeData(
  Object.keys(window.__esdoctorDataSource.metafile.inputs),
);

export function DependencyTreeView() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const filename = useMemo(
    () => selectedFile?.split('/').pop(),
    [selectedFile],
  );
  const module = selectedFile
    ? window.__esdoctorDataSource.metafile.inputs[selectedFile]
    : null;

  const renderContent = () => {
    if (module) {
      return (
        <div className="flex h-full flex-col">
          <div className="flex flex-col gap-1 p-2 pt-0">
            <div className="grid h-6 grid-cols-4">
              <p className="text-muted-foreground flex items-center text-sm">
                Path
              </p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="col-span-3 flex items-center overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {selectedFile}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{selectedFile}</TooltipContent>
              </Tooltip>
            </div>
            {module.format ? (
              <div className="grid h-6 grid-cols-4">
                <p className="text-muted-foreground flex items-center text-sm">
                  Format
                </p>
                <div className="col-span-3 flex items-center text-sm">
                  {
                    <Badge
                      variant="outline"
                      className={cn(
                        'px-1 py-[2px] text-xs',
                        module.format === 'esm'
                          ? 'border-blue-300 bg-blue-100 text-blue-500'
                          : 'border-yellow-300 bg-yellow-100 text-yellow-500',
                      )}
                    >
                      {module.format.toUpperCase()}
                    </Badge>
                  }
                </div>
              </div>
            ) : null}
            <div className="grid h-6 grid-cols-4">
              <p className="text-muted-foreground flex items-center text-sm">
                Bytes
              </p>
              <div className="col-span-3 flex items-center text-sm">
                {bytesToText(module.bytes)}
              </div>
            </div>
            <div className="grid h-6 grid-cols-4">
              <p className="text-muted-foreground flex items-center text-sm">
                Dependencies
              </p>
              <div className="col-span-3 flex items-center text-sm">
                {formatInteger(module.imports.length)}
              </div>
            </div>
          </div>
          <div className="h-full pl-4">
            {renderDependencies(module.imports)}
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground text-sm">
            Select a module to discover.
          </p>
        </div>
      );
    }
  };

  const renderDependencies = (
    imports: MetafileImports,
  ) => {
    function DependencyRow({ index, style, datas }: RowComponentProps<{ datas: MetafileImports }>) {
      const value = datas[index];
      const module = window.__esdoctorDataSource.metafile.inputs[value.path];

      return (
        <Tooltip key={value.path}>
          <TooltipTrigger asChild>
            <div
              style={style}
              className="hover:bg-muted/50 text-muted-foreground flex h-6 cursor-pointer items-center gap-2 rounded-md px-2 py-1"
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
      <div className="text-muted-foreground flex items-center gap-2 rounded-md px-2 py-1">
        <CornerDownRight size={16} />
        <p className="text-sm"> No dependencies found.</p>
      </div>
    ) : (
      <AutoSizer>
        {({ width, height }) => (
          <List
            rowHeight={30}
            style={{ width, height }}
            rowProps={{ datas: imports }}
            rowCount={imports.length}
            rowComponent={DependencyRow}
          />
        )}
      </AutoSizer>
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
            <div className="border-border h-full min-w-[280px] overflow-auto border-r">
              <FileTree
                data={data}
                focus={selectedFile}
                onFileClick={setSelectedFile}
              />
            </div>
            <div className="h-full w-full">
              <div className="flex h-full flex-col gap-2">
                <div className="border-border flex h-8 w-full items-center gap-2 border-b p-2">
                  {filename ? (
                    <>
                      <h2 className="text-sm">{filename}</h2>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex h-[16px] w-[16px] justify-center"
                        style={{ padding: 0 }}
                        onClick={() => setSelectedFile(null)}
                      >
                        <X className="text-gray-500" />
                      </Button>
                    </>
                  ) : null}
                </div>
                <div className="h-full w-full overflow-auto p-2 pt-0">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </SheetContent>
    </Sheet>
  );
}
