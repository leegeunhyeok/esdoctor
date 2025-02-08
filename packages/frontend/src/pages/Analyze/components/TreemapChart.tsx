import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { CardContent, CardDescription } from '@/components/ui/card';
import { Chart } from '@/src/components/Chart';
import {
  TreemapChartControlModal,
  type TreemapChartOptions,
} from './TreemapChartControlModal';
import type { ChartContentProps } from './types';
import { omit } from 'es-toolkit';
import { toChartData } from '@/src/utils/chart';

export function TreemapChart({ data, show }: ChartContentProps) {
  const [options, setOptions] = useState<TreemapChartOptions>({});

  return (
    <CardContent className={cn(show ? 'flex' : 'hidden', 'flex-col gap-4')}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Visualization</h2>
        <TreemapChartControlModal
          initialOptions={options}
          onApply={setOptions}
        />
      </div>
      <Chart
        type="treemap"
        className="h-[70vh] bg-neutral-50"
        data={useMemo(() => {
          return toChartData(data, {
            includeFilter: options.includeFilter,
            excludeFilter: options.excludeFilter,
          });
        }, [data, options.includeFilter, options.excludeFilter])}
        options={useMemo(
          () => omit(options, ['includeFilter', 'excludeFilter']),
          [options],
        )}
      />
      <CardDescription>
        This visualization shows which input files were placed into each output
        file in the bundle. Click on a node to expand and focus it.
      </CardDescription>
    </CardContent>
  );
}
