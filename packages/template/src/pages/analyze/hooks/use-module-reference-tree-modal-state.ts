import { useEffect, useRef, useState } from 'react';
import type { ChartRef } from '@/src/components/chart';
import {
  resolveModuleTree,
  type ModuleTreeItem,
} from '@/src/utils/resolve-module-tree';

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
  const [moduleItem, setModuleItem] = useState<ModuleItem | null>(null);

  useEffect(() => {
    const chart = chartRef.current?.getChart();

    if (chart == null) {
      return;
    }

    const handleClick = (event: echarts.ECElementEvent) => {
      if (event.componentType === 'series' && event.data) {
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

        setModuleItem({
          module: {
            path: modulePath,
            originSize,
            bundledSize,
          },
          referenceStack: resolveModuleTree(modulePath),
        });
      }
    };

    chart.on('click', handleClick);

    return () => void chart.off('click', handleClick);
  }, []);

  return { chartRef, moduleItem, reset: () => setModuleItem(null) };
}
