import React from 'react';
import { groupBy } from 'es-toolkit';
import { Chart } from '@/src/components/chart';
import { formatNumberWithDecimal } from '@/src/utils/format';
import { millisecondsToText } from '@/src/utils/time';
import type { TimelineData } from '../types';

interface DurationStackedBarChartProps {
  data: TimelineData[];
  traceNames: string[];
}

export const DurationStackedBarChart = React.memo(
  function DurationStackedBarChart({ data }: DurationStackedBarChartProps) {
    const { series, total } = getStackedBarChartSeries(data);

    return (
      <Chart
        className="min-h-[80px]"
        options={{
          tooltip: {
            trigger: 'item',
            formatter: (params) => {
              const { value, seriesName } = params;

              return [
                `From: ${seriesName}`,
                `Total duration: ${millisecondsToText(value)} (${formatNumberWithDecimal(
                  (value / total) * 100,
                )}%)`,
              ].join('<br>');
            },
            borderColor: 'var(--border)',
          },
          grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            height: 50,
            containLabel: true,
          },
          legend: {
            show: true,
            align: 'left',
            type: 'scroll',
            bottom: 0,
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            data: ['Duration'],
          },
        }}
        series={series as unknown as echarts.SeriesOption[]}
      />
    );
  },
);

function getStackedBarChartSeries(data: DurationStackedBarChartProps['data']) {
  let total = 0;
  const series = Object.entries(
    groupBy(data, (item) => `${item.name}:${item.type}`),
  ).map(([category, dataset]) => {
    const categoryTotalDuration = dataset.reduce(
      (acc, { duration }) => acc + duration,
      0,
    );

    total += categoryTotalDuration;

    return {
      name: category,
      data: [categoryTotalDuration],
      type: 'bar',
      stack: 'total',
      emphasis: {
        focus: 'series',
      },
    };
  });

  return { series, total };
}
