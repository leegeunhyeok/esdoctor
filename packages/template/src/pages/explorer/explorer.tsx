import { useMemo, useState } from 'react';
import { omit } from 'es-toolkit';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Page } from '@/src/components/page';
import { Select } from '@/src/components/select';
import {
  ChartControlModal,
  ChartOptions,
} from './components/chart-control-modal';
import { toChartData } from '@/src/utils/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TreemapChart } from './components/treemap-chart';
import { SunburstChart } from './components/sunburst-chart';
import { DependencyTreeView } from './components/dependency-tree-view';

const metafile = window.__esdoctorDataSource.metafile;

export function Explorer() {
  const [selectedView, setSelectedView] = useState('treemap');
  const [options, setOptions] = useState<ChartOptions>({});

  const chartData = useMemo(() => {
    return toChartData(metafile, {
      includeFilter: options.includeFilter,
      excludeFilter: options.excludeFilter,
    });
  }, [options.includeFilter, options.excludeFilter]);

  const chartOptions = useMemo(
    () => omit(options, ['includeFilter', 'excludeFilter']),
    [options],
  );

  const [selectedFile, setSelectedFile] = useState<string>(
    chartData[0].name ?? '',
  );

  const selectedChartData = chartData.find(
    (item) => item.name === selectedFile,
  );

  if (selectedChartData == null) {
    throw new Error('invalid chart data');
  }

  return (
    <Page>
      <Page.Header className="flex items-center justify-between">
        Explorer
        <DependencyTreeView />
      </Page.Header>
      <Page.Content>
        <Tabs defaultValue="treemap" onValueChange={setSelectedView}>
          <div className="flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="treemap">Treemap</TabsTrigger>
              <TabsTrigger value="sunburst">Sunburst</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <Select
                placeholder={{
                  empty: 'File not found',
                  search: 'Search file...',
                }}
                items={Object.values(chartData).map(({ name }) => ({
                  label: name ?? '',
                  value: name ?? '',
                }))}
                onSelect={setSelectedFile}
              />
              <ChartControlModal
                initialOptions={options}
                activeChart={selectedView}
                onApply={setOptions}
              />
            </div>
          </div>
          <TabsContent
            value="treemap"
            className="hidden data-[state=active]:block"
            forceMount
          >
            <Card>
              <CardHeader>
                <CardTitle>Treemap Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <CardDescription>
                  This visualization shows which input files were placed into
                  each output file in the bundle. Click on a node to expand and
                  focus it.
                </CardDescription>
                <TreemapChart data={selectedChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="sunburst"
            className="hidden data-[state=active]:block"
            forceMount
          >
            <Card>
              <CardHeader>
                <CardTitle>Sunburst Chart</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <CardDescription>
                  This visualization shows how much space each input file takes
                  up in the final bundle. Input files that take up 0 bytes have
                  been completely eliminated by tree-shaking.
                </CardDescription>
                <SunburstChart data={selectedChartData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Page.Content>
    </Page>
  );
}
