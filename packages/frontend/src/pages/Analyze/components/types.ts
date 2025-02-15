import type { ChartData } from '@/src/utils/chart';
import type { TreemapSeriesOption, SunburstSeriesOption } from 'echarts';

export interface ChartContentProps {
  data: ChartData;
  options?: TreemapSeriesOption | SunburstSeriesOption;
  show: boolean;
}
