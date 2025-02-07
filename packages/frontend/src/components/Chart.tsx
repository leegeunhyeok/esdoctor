import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts';
import * as esbuild from 'esbuild';
import traverse from 'traverse';
import { isNotNil, merge } from 'es-toolkit';
import { cn } from '@/lib/utils';
import { bytesToText } from '../utils/filesize';

export interface ChartProps {
  // TODO
  data: esbuild.Metafile;
  options?: echarts.TreemapSeriesOption | echarts.SunburstSeriesOption;
  type: ChartType;
  className?: string;
}

export interface ChartData {
  name?: string;
  path: string;
  value: number | undefined;
  size: number | undefined;
  children?: ChartData[];
}

export type ChartType = 'treemap' | 'sunburst';

export function Chart({ data: rawData, options, className }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    function processData(
      paths: string[],
      inputs: esbuild.Metafile['inputs'],
      bundledInputs: esbuild.Metafile['outputs'][string]['inputs'],
    ) {
      const key = Symbol();
      const data: ChartData[] = [];
      const level = { [key]: data };

      for (const path of paths.sort()) {
        let targetPath = path;
        const isProtocolPath = path.split(':').length - 1 === 1;

        if (isProtocolPath) {
          targetPath = targetPath.replace(':', ':/');
        }

        targetPath.split('/').reduce((prev, pathSegment, index, array) => {
          if (prev[pathSegment] != null) {
            return prev[pathSegment];
          }

          let depthBasedPath = array.slice(0, index + 1).join('/');
          prev[pathSegment] = { [key]: [] };

          if (isProtocolPath) {
            // Restore path
            depthBasedPath = depthBasedPath.replace(':/', ':');
          }

          const inputModule = inputs[depthBasedPath];
          const bundledModule = bundledInputs[depthBasedPath];

          prev[key].push({
            name: depthBasedPath.split('/').pop() ?? '',
            path: depthBasedPath,
            // Bundled size
            value: bundledModule?.bytesInOutput,
            // Original size
            size: inputModule?.bytes,
            children: prev[pathSegment][key],
          });

          return prev[pathSegment];
        }, level);
      }

      traverse(data).forEach(function () {
        if (this.isRoot) {
          return;
        }

        this.after(function () {
          const isSingleChild = this.node?.children?.length === 1;
          if (isSingleChild) {
            this.update(this.node.children[0]);
          }
        });
      });

      return data;
    }

    return Object.entries(rawData.outputs)
      .filter(([outputFileName]) => !outputFileName.endsWith('.map'))
      .map(([outputFileName, meta]) => {
        const { inputs, bytes } = meta;
        const moduleList = Object.keys(inputs).filter(
          (path) => !path.startsWith('(disabled)'),
        );

        return {
          name: outputFileName.split('/').pop() ?? '',
          path: outputFileName,
          value: bytes,
          size: 0,
          children: processData(moduleList, rawData.inputs, inputs),
        } as ChartData;
      });
  }, [rawData]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const observer = new ResizeObserver(() => {
      chartRef.current && echarts.getInstanceByDom(chartRef.current)?.resize();
    });

    observer.observe(chartRef.current);

    return () => observer.disconnect();
  }, [chartRef]);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const chart = echarts.init(chartRef.current);
    chart.setOption<echarts.EChartsOption>({
      tooltip: {
        formatter: (params) => {
          const { path, value: bundledSize, size: originalSize } = params.data;
          const isModule = typeof originalSize === 'number';

          return [
            `<div class="chart-tooltip">`,
            isModule
              ? `<div class="value">Bundled Size: ${bytesToText(bundledSize)}</div>`
              : null,
            isModule && typeof originalSize === 'number'
              ? `<div class="value">Original Size: ${bytesToText(originalSize)}</div>`
              : null,
            path ?? `<div>Path: ${path}</div>`,
            `</div>`,
          ]
            .filter(isNotNil)
            .join('');
        },
      },
      series: [],
    });
  }, []);

  useEffect(() => {
    if (chartRef.current == null) {
      return;
    }

    const chart = echarts.getInstanceByDom(chartRef.current);
    chart?.setOption(
      {
        series: [
          getTreemapSeries(data, options as echarts.TreemapSeriesOption),
        ],
      },
      { notMerge: false },
    );
  }, [data, options]);

  return (
    <div
      className={cn(
        'flex h-full h-[50vh] min-h-[400px] w-full items-stretch',
        className,
      )}
    >
      <div ref={chartRef} style={{ width: '100%' }} />
    </div>
  );
}

function getTreemapSeries(
  data: ChartData[],
  additionalOptions: echarts.TreemapSeriesOption = {},
): echarts.TreemapSeriesOption {
  return merge(
    {
      type: 'treemap',
      name: data[0].name,
      data: data[0].children,
      width: '100%',
      height: '100%',
      label: {
        show: true,
      },
      upperLabel: {
        show: true,
        height: 20,
        position: 'insideTop',
        fontSize: 12,
        distance: 10,
        color: '#fff',
        formatter: (params) => {
          return params.name.split('/').pop() ?? '';
        },
      },
      breadcrumb: {
        show: true,
        bottom: 50,
      },
      itemStyle: {
        color: '#555',
        gapWidth: 1,
        borderColorSaturation: 0.4,
        colorSaturation: 0.5,
      },
      emphasis: {
        upperLabel: {
          position: 'insideTop',
        },
      },
      colorBy: 'series',
      roam: false,
      levels: [
        {
          color: [
            '#3b82f6',
            '#eab308',
            '#f43f5e',
            '#22c55e',
            '#8b5cf6',
            '#f97316',
            '#2dd4bf',
          ],
          itemStyle: {
            gapWidth: 1,
            borderColor: '#555',
          },
        },
      ],
    },
    additionalOptions,
  );
}
