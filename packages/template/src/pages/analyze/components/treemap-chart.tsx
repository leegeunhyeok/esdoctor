import { Chart } from '@/src/components/chart';
import type { ChartData } from '@/src/utils/chart';
import { useTreemapSeries } from '../hooks/use-treemap-series';
import { tooltip } from '../tooltip';
import { ModuleReferenceTreeModal } from './module-reference-tree-modal';
import {
  EMPTY_MODULE,
  useModuleReferenceTreeModalState,
} from '../hooks/use-module-reference-tree-modal-state';

export interface TreemapChartProps {
  data: ChartData;
  options?: echarts.TreemapSeriesOption;
}

export function TreemapChart({ data, options }: TreemapChartProps) {
  const { chartRef, moduleItem, reset } = useModuleReferenceTreeModalState();
  const series = useTreemapSeries(data, options);

  return (
    <>
      <Chart
        ref={chartRef}
        className="h-[70vh] bg-neutral-50"
        series={[series]}
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

const chartOptions: echarts.EChartsOption = {
  tooltip,
  series: [],
};
