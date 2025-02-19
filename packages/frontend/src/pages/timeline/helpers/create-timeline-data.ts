import type { HookTrace } from '@esdoctor/types';
import type { TimelineData } from '../types';

export function createTimelineData(traceList: HookTrace[]) {
  let startTimestamp = Number.MAX_SAFE_INTEGER;
  let lastTimestamp = 0;

  const labelNames: string[] = [];
  const timelineData = traceList.map((trace) => {
    const label = `${trace.name}:${trace.type}`;

    startTimestamp = Math.min(startTimestamp, trace.duration.start);
    lastTimestamp = Math.max(lastTimestamp, trace.duration.end);
    labelNames.push(label);

    return {
      label,
      name: trace.name,
      type: trace.type,
      start: trace.duration.start,
      end: trace.duration.end,
      duration: trace.duration.end - trace.duration.start,
      data: trace.data,
      code: trace.code,
    } as TimelineData;
  });

  const traceNames = Array.from(
    new Set(labelNames.sort((a, b) => (a > b ? -1 : 1))),
  );

  const traceNameIndexMap = Object.fromEntries(
    traceNames.map((name, index) => [name, index]),
  );

  return {
    timelineData: timelineData
      .sort((a, b) => a.start - b.start)
      .map((item) => ({
        ...item,
        start: item.start - startTimestamp,
        end: item.end - startTimestamp,
      })),
    traceNames,
    traceNameIndexMap,
    min: 0,
    max: lastTimestamp - startTimestamp,
  };
}
