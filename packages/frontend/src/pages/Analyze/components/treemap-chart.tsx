import { Chart } from '@/src/components/chart';
import type { ChartData } from '@/src/utils/chart';
import { useTreemapSeries } from '../hooks/use-treemap-series';
import { tooltip } from '../tooltip';

export interface TreemapChartProps {
  data: ChartData;
  options?: echarts.TreemapSeriesOption;
}

export function TreemapChart({ data, options }: TreemapChartProps) {
  const series = useTreemapSeries(data, options);

  return (
    <Chart
      className="h-[70vh] bg-neutral-50"
      series={series}
      options={chartOptions}
    />
  );
}

const chartOptions: echarts.EChartsOption = {
  tooltip,
  series: [],
};
