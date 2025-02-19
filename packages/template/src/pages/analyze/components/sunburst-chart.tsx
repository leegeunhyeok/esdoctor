import { useMemo } from 'react';
import { Chart } from '@/src/components/chart';
import type { ChartData } from '@/src/utils/chart';
import { bytesToText } from '@/src/utils/filesize';
import { useSunburstSeries } from '../hooks/use-sunburst-series';
import { tooltip } from '../tooltip';
import { ModuleReferenceTreeModal } from './module-reference-tree-modal';
import {
  EMPTY_MODULE,
  useModuleReferenceTreeModalState,
} from '../hooks/use-module-reference-tree-modal-state';

export interface SunburstChartProps {
  data: ChartData;
  options?: echarts.SunburstSeriesOption;
}

export function SunburstChart({ data, options }: SunburstChartProps) {
  const { chartRef, moduleItem, reset } = useModuleReferenceTreeModalState();
  const series = useSunburstSeries(data, options);
  const chartOptions = useMemo(() => getChartOptions(data.value ?? 0), [data]);

  return (
    <>
      <Chart
        ref={chartRef}
        className="h-[70vh] bg-neutral-50"
        series={series}
        options={chartOptions}
      />
      <ModuleReferenceTreeModal
        open={Boolean(moduleItem)}
        module={moduleItem?.module ?? EMPTY_MODULE}
        referenceStack={moduleItem?.referenceStack ?? []}
        onOpenChange={reset}
      />
    </>
  );
}

const getChartOptions = (maxSize: number): echarts.EChartsOption => ({
  tooltip,
  visualMap: {
    type: 'continuous',
    min: 0,
    max: maxSize,
    inRange: {
      color: ['#3b82f6', '#22c55e', '#eab308', '#f43f5e', '#a855f7'],
    },
    orient: 'horizontal',
    top: 8,
    right: 8,
    formatter: (value) => {
      return typeof value === 'number'
        ? bytesToText(value)
        : (value?.toString() ?? '');
    },
  },
});
