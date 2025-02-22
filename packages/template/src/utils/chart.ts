import traverse from 'traverse';
import { merge } from 'es-toolkit';
import type * as esbuild from 'esbuild';
import { ANIMATION_DURATION } from '@/src/constants';

export interface ToChartDataOptions {
  includeFilter?: string;
  excludeFilter?: string;
}

export interface ChartData {
  name?: string;
  path: string;
  value: number | undefined;
  size: number | undefined;
  children?: ChartData[];
}

export function toChartData(
  rawData: esbuild.Metafile,
  options: ToChartDataOptions,
) {
  const includeFilter = options.includeFilter
    ? new RegExp(options.includeFilter)
    : undefined;
  const excludeFilter = options.excludeFilter
    ? new RegExp(options.excludeFilter)
    : undefined;

  return Object.entries(rawData.outputs)
    .filter(([outputFileName]) => !outputFileName.endsWith('.map'))
    .map(([outputFileName, meta]) => {
      const { inputs, bytes } = meta;
      const moduleList = Object.keys(inputs).filter((path) => {
        if (excludeFilter?.test(path)) {
          return false;
        }

        if (includeFilter?.test(path)) {
          return true;
        }

        return true;
      });

      return {
        name: outputFileName.split('/').pop() ?? '',
        path: outputFileName,
        value: bytes,
        size: 0,
        children: pathToChartData(moduleList, rawData.inputs, inputs),
      } as ChartData;
    });
}

function pathToChartData(
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

  return optimizeNestedPath(data);
}

function optimizeNestedPath(data: ChartData[]) {
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

export function getTreemapSeries(
  data: ChartData,
  additionalOptions: echarts.TreemapSeriesOption = {},
): echarts.TreemapSeriesOption {
  const baseOptions: echarts.TreemapSeriesOption = {
    type: 'treemap',
    name: data.name,
    data: data.children,
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
    animationDuration: ANIMATION_DURATION,
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
  };

  return merge(baseOptions, additionalOptions);
}

export const getSunburstSeries = (
  data: ChartData,
  additionalOptions: echarts.SunburstSeriesOption = {},
): echarts.SunburstSeriesOption => {
  const baseOptions: echarts.SunburstSeriesOption = {
    type: 'sunburst',
    radius: ['5%', '90%'],
    nodeClick: 'rootToNode',
    data: data.children,
    universalTransition: true,
    animationDuration: ANIMATION_DURATION,
    animationDurationUpdate: ANIMATION_DURATION,
    itemStyle: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,.5)',
    },
    label: {
      show: false,
    },
  };

  return merge(baseOptions, additionalOptions);
};
