import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '@/src/components/data-table-column-header';
import { millisecondsToText } from '@/src/utils/time';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

function getColorByType(type: string) {
  switch (type) {
    case 'onStart':
      return 'border-red-300 bg-red-100 text-red-500';
    case 'onResolve':
      return 'border-yellow-300 bg-yellow-100 text-yellow-500';
    case 'onLoad':
      return 'border-blue-300 bg-blue-100 text-blue-500';
    case 'onDispose':
      return 'border-green-300 bg-green-100 text-green-500';
    case 'onEnd':
      return 'border-purple-300 bg-purple-100 text-purple-500';
    default:
      return;
  }
}

export const columns: ColumnDef<{
  start: number;
  end: number;
  duration: number;
  name: string;
  type: string;
}>[] = [
  {
    accessorKey: 'plugin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plugin" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className={cn('text-xs', getColorByType(row.original.type))}
        >
          {row.original.type}
        </Badge>
        <div>{row.original.name}</div>
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Duration" />
    ),
    cell: ({ row }) => (
      <div>
        {millisecondsToText(
          row.original.duration,
          row.original.duration >= 1000 ? 3 : 1,
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'start',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start" />
    ),
    cell: ({ row }) => (
      <div>
        {millisecondsToText(
          row.original.start,
          row.original.start >= 1000 ? 3 : 1,
        )}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'end',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="End" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {millisecondsToText(
            row.original.end,
            row.original.end >= 1000 ? 3 : 1,
          )}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
];
