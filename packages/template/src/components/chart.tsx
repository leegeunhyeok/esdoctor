import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as echarts from 'echarts';
import { cn } from '@/lib/utils';

export interface ChartProps {
  options: echarts.EChartsOption;
  series: echarts.SeriesOption;
  className?: string;
}

export interface ChartRef {
  getChart: () => echarts.ECharts | null;
}

const UNRECOGNIZED_SIZE = { width: -1, height: -1 };

function isInvisible(width: number, height: number) {
  return width === 0 || height === 0;
}

function initialize(element: HTMLElement) {
  const existingChart = echarts.getInstanceByDom(element);

  if (existingChart != null) {
    return existingChart;
  }

  return echarts.init(element);
}

export const Chart = memo(
  forwardRef<ChartRef, ChartProps>(function Chart(
    { options, series, className }: ChartProps,
    ref,
  ) {
    const chartRef = useRef<echarts.ECharts | null>(null);
    const elementRef = useRef<HTMLDivElement>(null);
    const sizeRef = useRef(UNRECOGNIZED_SIZE);

    useEffect(() => {
      if (elementRef.current == null) {
        return;
      }

      const element = elementRef.current;
      const chart = (chartRef.current = initialize(element));
      const observer = new ResizeObserver(() => {
        if (elementRef.current == null) {
          return;
        }

        const { width: prevWidth, height: prevHeight } = sizeRef.current;
        const { width, height } = elementRef.current.getBoundingClientRect();

        if (isInvisible(width, height)) {
          return;
        }

        sizeRef.current = { width, height };

        if (prevWidth !== width || prevHeight !== height) {
          chart.resize();
        }
      });

      chart.setOption({ ...options, series: [series] });
      observer.observe(element);

      return () => observer.disconnect();
    }, [options, series]);

    useImperativeHandle(
      ref,
      () => ({
        getChart: () => chartRef.current,
      }),
      [],
    );

    return (
      <div
        className={cn(
          'flex h-[50vh] h-full min-h-[400px] w-full items-stretch',
          className,
        )}
      >
        <div ref={elementRef} style={{ width: '100%' }} />
      </div>
    );
  }),
);
