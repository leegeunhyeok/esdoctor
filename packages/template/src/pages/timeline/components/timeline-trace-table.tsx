import { useState } from 'react';
import { DataTable } from '@/src/components/data-table';
import { TimelineDetailModal } from './timeline-detail-modal';
import { columns } from './columns';
import type { TimelineData } from '../types';

export interface TimelineTraceTableProps {
  data: TimelineData[];
}

export function TimelineTraceTable({ data }: TimelineTraceTableProps) {
  const [traceDetails, setTraceDetails] = useState<Pick<
    TimelineData,
    'start' | 'end' | 'data' | 'code'
  > | null>(null);

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        initialSorting={[{ id: 'start', desc: false }]}
        onRowClick={setTraceDetails}
      />
      <TimelineDetailModal
        open={Boolean(traceDetails)}
        details={traceDetails}
        onOpenChange={() => setTraceDetails(null)}
      />
    </>
  );
}
