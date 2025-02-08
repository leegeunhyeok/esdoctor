import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import { isNotNil } from 'es-toolkit';
import { cn } from '@/lib/utils';
import { bytesToText } from '../utils/filesize';
import { getTreemapSeries } from '../utils/chart';

export interface ChartProps {
  data: ChartData[];
  options?: echarts.TreemapSeriesOption | echarts.SunburstSeriesOption;
  type: ChartType;
  className?: string;
}

export interface ChartData {
  name?: string;
  path: string;
  value: number | undefined;
  size: number | undefined;
  children?: ChartData[];
}

export type ChartType = 'treemap' | 'sunburst';

export function Chart({ data, options, className }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const memoizedData = useMemo(() => data, [data]);
  const dataRef = useRef(memoizedData);

  const initialize = useCallback(() => {
    if (chartRef.current == null) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    chart.setOption<echarts.EChartsOption>({
      tooltip: {
        formatter: (params) => {
          const { path, value: bundledSize, size: originalSize } = params.data;
          const isModule = typeof originalSize === 'number';

          if (path == null) {
            return '';
          }

          return [
            `<div class="chart-tooltip">`,
            isModule
              ? `<div class="value">Bundled Size: ${bytesToText(bundledSize)}</div>`
              : null,
            isModule && typeof originalSize === 'number'
              ? `<div class="value">Original Size: ${bytesToText(originalSize)}</div>`
              : null,
            `<div>Path: ${path}</div>`,
            `</>`,
          ]
            .filter(isNotNil)
            .join('');
        },
      },
      series: [],
    });

    return chart;
  }, [chartRef]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const observer = new ResizeObserver(() => {
      chartRef.current && echarts.getInstanceByDom(chartRef.current)?.resize();
    });

    observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, [chartRef]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    initialize();
  }, []);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    let chart = echarts.getInstanceByDom(chartRef.current);

    if (dataRef.current !== memoizedData) {
      chart?.dispose();
      chart = initialize();
    }

    chart?.setOption(
      {
        series: [
          getTreemapSeries(
            memoizedData,
            options as echarts.TreemapSeriesOption,
          ),
        ],
      },
      { notMerge: false },
    );
  }, [memoizedData, options]);

  return (
    <div
      className={cn(
        'flex h-[50vh] h-full min-h-[400px] w-full items-stretch',
        className,
      )}
    >
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
}
