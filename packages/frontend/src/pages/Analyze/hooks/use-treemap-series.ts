import { useMemo } from 'react';
import { getTreemapSeries, type ChartData } from '@/src/utils/chart';

export function useTreemapSeries(
  data: ChartData,
  options?: echarts.TreemapSeriesOption,
) {
  return useMemo(() => getTreemapSeries(data, options), [data, options]);
}
