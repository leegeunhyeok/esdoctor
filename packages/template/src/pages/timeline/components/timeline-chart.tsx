import { useMemo } from 'react';
import { Chart } from '@/src/components/chart';
import { formatInteger, formatNumberWithDecimal } from '@/src/utils/format';

interface TimelineChartProps {
  data: (readonly [number, number, string, number])[];
  min: number;
  max: number;
  traceNames: string[];
  traceNameIndexMap: Record<string, number>;
}

const COLORS = [
  '#3b82f6',
  '#eab308',
  '#f43f5e',
  '#22c55e',
  '#8b5cf6',
  '#f97316',
  '#2dd4bf',
];

export function TimelineChart({
  data,
  min,
  max,
  traceNames,
  traceNameIndexMap,
}: TimelineChartProps) {
  return (
    <Chart
      className="h-[60vh]"
      options={{
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { value } = params;
            return [
              `${value[2]}`,
              `Trace count: ${value[3]}`,
              `Started from: ${formatNumberWithDecimal(value[0])} ms`,
              `Ended at: ${formatNumberWithDecimal(value[1])} ms`,
            ].join('<br>');
          },
          borderColor: 'var(--border)',
        },
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 60,
          containLabel: true,
        },
        xAxis: {
          type: 'time',
          min,
          max: max + 10,
          boundaryGap: [0, 0],
          axisLabel: {
            formatter: (value) => `${formatInteger(value)} ms`,
          },
        },
        yAxis: {
          type: 'category',
          data: traceNames.reverse(),
          inverse: true,
          axisLabel: {
            fontSize: 10,
          },
        },
        dataZoom: [
          {
            type: 'slider',
            showDetail: false,
            height: 24,
            left: 32,
            right: 16,
          },
        ],
      }}
      series={useMemo(
        () => [
          {
            type: 'custom',
            renderItem: (_params, api) => {
              const startValue = api.value(0);
              const endValue = api.value(1);
              const label = api.value(2);
              const categoryIndex = traceNameIndexMap[label];
              const start = api.coord([startValue, categoryIndex]);
              const end = api.coord([endValue, categoryIndex]);
              const height = api.size?.([0, 1])[1] * 0.8;

              return {
                type: 'rect',
                shape: {
                  x: start[0],
                  y: start[1] - height / 2,
                  width: Math.max(end[0] - start[0], 3),
                  height: height,
                  r: 2,
                },
                style: {
                  ...api.style(),
                  fill: COLORS[categoryIndex % COLORS.length],
                },
              };
            },
            data,
          },
        ],
        [data, traceNameIndexMap],
      )}
    />
  );
}
