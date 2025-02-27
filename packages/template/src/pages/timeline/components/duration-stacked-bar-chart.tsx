import { Chart } from '@/src/components/chart';
import { formatNumberWithDecimal } from '@/src/utils/format';
import { groupBy } from 'es-toolkit';

interface DurationStackedBarChartProps {
  data: {
    start: number;
    end: number;
    duration: number;
    name: string;
    type: string;
    data: Record<string, unknown>;
    code?: string;
  }[];
  traceNames: string[];
}

export function DurationStackedBarChart({
  data,
}: DurationStackedBarChartProps) {
  const { series, total } = getStackedBarChartSeries(data);

  return (
    <Chart
      className="h-[60vh]"
      options={{
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            const { value, seriesName } = params;

            return [
              `From: ${seriesName}`,
              `Total duration: ${formatNumberWithDecimal(value)}ms (${formatNumberWithDecimal(
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
          bottom: 60,
          containLabel: true,
        },
        legend: {},
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
}

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
