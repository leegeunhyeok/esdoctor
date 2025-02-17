import { useMemo } from 'react';
import { getSunburstSeries, type ChartData } from '@/src/utils/chart';

export function useSunburstSeries(
  data: ChartData,
  options?: echarts.SunburstSeriesOption,
) {
  return useMemo(() => getSunburstSeries(data, options), [data, options]);
}
