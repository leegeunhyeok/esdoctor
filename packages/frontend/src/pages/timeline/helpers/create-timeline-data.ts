import type { HookTrace } from '@esdoctor/types';

export function createTimelineData(traceList: HookTrace[]) {
  let startTimestamp = Number.MAX_SAFE_INTEGER;
  let lastTimestamp = 0;
  const groupedTasks: Record<
    string,
    Array<Array<HookTrace & { level: number }>>
  > = {};
  const labelNames: string[] = [];
  const timelineData = traceList
    .sort((a, b) => a.duration.start - b.duration.start)
    .filter(
      (trace) =>
        Math.random() > 0.99 ||
        trace.type === 'onEnd' ||
        trace.type == 'onStart',
    )
    .map((trace) => {
      const label = trace.type;

      startTimestamp = Math.min(startTimestamp, trace.duration.start);
      lastTimestamp = Math.max(lastTimestamp, trace.duration.end);
      labelNames.push(label);

      if (!groupedTasks[label]) {
        groupedTasks[label] = [];
      }

      let assigned = false;
      let assignedLevel = 0;
      for (let level = 0; level < groupedTasks[label].length; level++) {
        const lastTrace = groupedTasks[label][level].slice(-1)[0];
        if (lastTrace.duration.end <= trace.duration.start) {
          groupedTasks[label][level].push({ ...trace, level });
          assignedLevel = level;
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        groupedTasks[label].push([
          {
            ...trace,
            level: (assignedLevel = Math.max(
              0,
              groupedTasks[label].length - 1,
            )),
          },
        ]);
      }

      return {
        label,
        name: trace.name,
        start: trace.duration.start,
        end: trace.duration.end,
        level: assignedLevel,
        data: trace.data,
        code: trace.code,
      };
    });

  const traceNames = Array.from(
    new Set(labelNames.sort((a, b) => (a > b ? -1 : 0))),
  );

  const traceNameIndexMap = Object.fromEntries(
    traceNames.map((name, index) => [name, index]),
  );

  const traceNameMaxLevel = timelineData.reduce(
    (acc, data) => ({ ...acc, [data.label]: (acc[data.label] ?? 0) + 1 }),
    {} as Record<string, number>,
  );

  return {
    timelineData: timelineData.map(
      (item) =>
        [
          item.start - startTimestamp,
          item.end - startTimestamp,
          item.level,
          item.label,
          item.name,
          item.data,
          item.code,
        ] as const,
    ),
    traceNames,
    traceNameIndexMap,
    traceNameMaxLevel,
    min: 0,
    max: lastTimestamp - startTimestamp,
  };
}
