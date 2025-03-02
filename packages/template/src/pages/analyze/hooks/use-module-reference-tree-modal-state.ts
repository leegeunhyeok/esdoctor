import { useEffect, useRef, useState } from 'react';
import type { ChartRef } from '@/src/components/chart';
import {
  resolveModuleTree,
  type ModuleTreeItem,
} from '@/src/utils/resolve-module-tree';
import { ANIMATION_DURATION } from '@/src/constants';

export interface ModuleItem {
  module: {
    path: string;
    originSize: number;
    bundledSize: number;
  };
  referenceStack: ModuleTreeItem[];
}

export const EMPTY_MODULE: ModuleItem['module'] = {
  path: '',
  originSize: 0,
  bundledSize: 0,
};

export function useModuleReferenceTreeModalState() {
  const chartRef = useRef<ChartRef>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevDataIndexRef = useRef<number | null>(null);
  const [moduleItem, setModuleItem] = useState<ModuleItem | null>(null);

  useEffect(() => {
    const chart = chartRef.current?.getChart();

    if (chart == null) {
      return;
    }

    const handleClick = (event: echarts.ECElementEvent) => {
      if (event.componentType === 'series' && event.data) {
        if (typeof timerRef.current === 'number') {
          clearTimeout(timerRef.current);
        }

        const {
          path: modulePath,
          size: originSize,
          value: bundledSize,
        } = event.data as {
          name: string;
          path: string;
          size: number;
          value: number;
        };

        if (originSize == null || bundledSize == null) {
          return;
        }

        const modalOpenDelay =
          prevDataIndexRef.current === event.dataIndex
            ? 0
            : ANIMATION_DURATION + 250;

        prevDataIndexRef.current = event.dataIndex;
        timerRef.current = setTimeout(() => {
          setModuleItem({
            module: {
              path: modulePath,
              originSize,
              bundledSize,
            },
            referenceStack: resolveModuleTree(modulePath),
          });
        }, modalOpenDelay);
      }
    };

    chart.on('click', handleClick);

    return () => void chart.off('click', handleClick);
  }, []);

  return { chartRef, moduleItem, reset: () => setModuleItem(null) };
}
