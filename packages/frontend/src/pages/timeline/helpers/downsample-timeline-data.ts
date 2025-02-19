import type { TimelineData } from '../types';

export function downsampleTimelineData(data: TimelineData[]) {
  const groupedSize = data.reduce(
    (acc, { type, name }) => {
      const label = `${name}:${type}`;
      return { ...acc, [label]: (acc[label] ?? 0) + 1 };
    },
    {} as Record<string, number>,
  );
  const rangeData = data.reduce(
    (acc, { start, end, name, type }) => {
      const label = `${name}:${type}`;
      const data =
        label in acc
          ? {
              start: Math.min(acc[label].start, start),
              end: Math.max(acc[label].end, end),
            }
          : { start, end };

      return { ...acc, [label]: data };
    },
    {} as Record<string, { start: number; end: number }>,
  );

  const downsampledData = Object.entries(rangeData).map(
    ([label, { start, end }]) =>
      [start, end, label, groupedSize[label] ?? 0] as const,
  );

  return { seriesData: downsampledData };
}
