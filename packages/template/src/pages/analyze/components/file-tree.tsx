import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider } from '@radix-ui/react-tooltip';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type GroupedPaths = (string | (string | GroupedPaths)[])[];

export type FileTreeProps = {
  data: GroupedPaths;
  focus: string | null;
  className?: string;
  onFileClick: (path: string) => void;
};

export type FileTreeItem = {
  name: string;
  path: string;
  children?: FileTreeItem[];
  isDirectory: boolean;
};

function parseFileTree(data: GroupedPaths, basePath = ''): FileTreeItem[] {
  const toPath = (...parts: string[]) => {
    return parts.filter(Boolean).join('/');
  };

  return data.map((item) => {
    const isDirectory = Array.isArray(item) && item.length > 1;

    if (isDirectory) {
      const dirName = item[0] as string;
      const dirPath = toPath(basePath, dirName);
      const children = item.slice(1);

      return {
        name: dirName,
        path: dirPath,
        isDirectory: true,
        children: parseFileTree(children, dirPath),
      };
    } else if (typeof item === 'string') {
      return {
        name: item,
        path: toPath(basePath, item),
        isDirectory: false,
      };
    }

    return {
      name: String(item),
      path: toPath(basePath, String(item)),
      isDirectory: false,
    };
  });
}

export function FileTree({
  data,
  focus,
  className,
  onFileClick,
}: FileTreeProps) {
  const items = useMemo(() => parseFileTree(data), [data]);

  return (
    <TooltipProvider>
      <div className={cn('h-full overflow-auto', className)}>
        <div className="h-full p-2">
          {items.map((item) => (
            <FileTreeNode
              isParentExpanded={true}
              key={item.path}
              item={item}
              focus={focus}
              level={0}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

type FileTreeNodeProps = {
  item: FileTreeItem;
  focus: string | null;
  level: number;
  isParentExpanded: boolean;
  onFileClick: (path: string) => void;
};

function FileTreeNode({
  item,
  focus,
  level,
  isParentExpanded,
  onFileClick,
}: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const isFocused = focus === item.path;

  useEffect(() => {
    if (focus == null || item.isDirectory === false) {
      return;
    }

    if (focus.startsWith(item.path)) {
      console.log('focusedDirectory', focus, item.path);
      setIsExpanded(true);
    }
  }, [focus]);

  const handleClick = () => {
    if (item.isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item.path);
    }
  };

  return (
    <div>
      {isParentExpanded ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              style={{ paddingLeft: `${level * 6}px` }}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              aria-expanded={item.isDirectory ? isExpanded : undefined}
            >
              {item.isDirectory ? (
                <div
                  className={cn(
                    'hover:bg-muted/50 flex cursor-pointer items-center rounded-md px-2 py-1',
                    isFocused && 'bg-gray-100 hover:bg-gray-100',
                  )}
                >
                  {isExpanded ? (
                    <ChevronDown className="text-muted-foreground mr-1 h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="text-muted-foreground mr-1 h-4 w-4 shrink-0" />
                  )}
                  <Folder className="mr-2 h-4 w-4 shrink-0 text-blue-400" />
                  <span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              ) : (
                <div
                  className={cn(
                    'hover:bg-muted/50 flex cursor-pointer items-center rounded-md px-2 py-1',
                    isFocused && 'bg-gray-100 hover:bg-gray-100',
                  )}
                  onClick={handleClick}
                >
                  <span className="mr-1 w-4" />
                  <File className="text-muted-foreground mr-2 h-4 w-4 shrink-0" />
                  <span className="overflow-hidden text-sm text-ellipsis whitespace-nowrap">
                    {item.name}
                  </span>
                </div>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.path}</p>
          </TooltipContent>
        </Tooltip>
      ) : null}
      {item.isDirectory && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeNode
              key={child.path}
              item={child}
              focus={focus}
              level={level + 1}
              onFileClick={onFileClick}
              isParentExpanded={isParentExpanded === false ? false : isExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}
