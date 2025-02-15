import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/src/components/page';
import { Chart, type ChartRef } from '@/src/components/chart';
import { formatInteger, formatNumberWithDecimal } from '@/src/utils/format';
import { createTimelineData } from './helpers/create-timeline-data';
import { TimelineDetailModal } from './components/timeline-detail-modal';
import { toJSON } from '@/src/utils/to-json';

const data = createTimelineData(window.$$dataSource.traceList);

export function Timeline() {
  const chartRef = useRef<ChartRef>(null);
  const [traceDetails, setTraceDetails] = useState<{
    start: number;
    end: number;
    data?: string;
    code?: string;
  } | null>(null);

  useEffect(() => {
    const chart = chartRef.current?.getChart();

    chart?.on('click', (params) => {
      if (params.componentType === 'series' && Array.isArray(params.data)) {
        const [start, end, _level, _label, _name, data, code] =
          // eslint-disable-next-line no-explicit-any
          params.data as [number, number, number, string, string, any, any];

        setTraceDetails({
          start,
          end,
          data: toJSON(data),
          code: code,
        });
      }
    });
  }, []);

  return (
    <Page>
      <Page.Header>Timeline</Page.Header>
      <Page.Content>
        <Card>
          <CardHeader className="mb-1 flex flex-row items-center justify-between">
            <CardTitle className="mb-0">Build timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Chart
              ref={chartRef}
              className="h-[60vh]"
              options={{
                tooltip: {
                  trigger: 'item',
                  formatter: (params) => {
                    const { value } = params;
                    return [
                      `${value[4]}:${value[3]}`,
                      `Duration: ${formatNumberWithDecimal(
                        value[1] - value[0],
                      )}ms`,
                      `Start: ${formatNumberWithDecimal(value[0])} ms`,
                      `End: ${formatNumberWithDecimal(value[1])} ms`,
                    ].join('<br>');
                  },
                  borderColor: 'var(--border)',
                },
                legend: {
                  data: data.traceNames,
                  selectedMode: 'multiple',
                },
                grid: {
                  left: 0, // 좌측 여백 최소화
                  right: 0, // 우측 여백 최소화
                  top: 0, // 상단 여백 최소화
                  bottom: 60, // 하단 여백 최소화
                  containLabel: true, // 라벨이 차트 안에 포함되도록 설정
                },
                xAxis: {
                  type: 'time',
                  min: data.min,
                  max: data.max,
                  boundaryGap: [0, 0],
                  axisLabel: {
                    formatter: (value) => `${formatInteger(value)} ms`,
                  },
                },
                yAxis: {
                  type: 'category',
                  data: data.traceNames,
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
              series={{
                type: 'custom',
                renderItem: (_params, api) => {
                  const startValue = api.value(0);
                  const endValue = api.value(1);
                  const level = api.value(2);
                  const label = api.value(3);
                  const baseCategoryIndex = data.traceNameIndexMap[label];
                  const start = api.coord([startValue, baseCategoryIndex]);
                  const end = api.coord([endValue, baseCategoryIndex]);
                  const height = api.size?.([0, 1])[1] * 0.8;
                  const maxLevel = data.traceNameMaxLevel[label] || 1;
                  const levelOffset =
                    (maxLevel - (level as number) - 1) * (height / maxLevel);

                  return {
                    type: 'rect',
                    shape: {
                      x: start[0],
                      y: start[1] - height / 2 + levelOffset,
                      width: end[0] - start[0],
                      height: height / maxLevel - 1,
                      r: 2,
                    },
                    style: {
                      ...api.style(),
                      fill: [
                        '#3b82f6',
                        '#eab308',
                        '#f43f5e',
                        '#22c55e',
                        '#8b5cf6',
                        '#f97316',
                        '#2dd4bf',
                      ][baseCategoryIndex % 7],
                    },
                  };
                },
                data: data.timelineData,
              }}
            />
          </CardContent>
        </Card>
      </Page.Content>
      <TimelineDetailModal
        open={Boolean(traceDetails)}
        details={traceDetails}
        onOpenChange={() => setTraceDetails(null)}
      />
    </Page>
  );
}
