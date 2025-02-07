import { Page } from '../components/Page';
import { Card, CardContent, CardDescription } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { loadMetafile } from '../utils/loadMetafile';
import { Chart, ChartType } from '../components/Chart';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useDebounce } from '../hooks/useDebounce';

const toggleActiveClass = 'border-b-gray-600 bg-white';

const metafile = loadMetafile();

export function Analyze() {
  const [selectedView, setSelectedView] = useState<ChartType>('treemap');

  return (
    <Page>
      <Page.Header>Analyze</Page.Header>
      <Page.Content>
        <Card>
          <ChartToggle
            selectedView={selectedView}
            setSelectedView={setSelectedView}
          />
          <TreemapChartContent show={selectedView === 'treemap'} />
          <SunburstChartContent show={selectedView === 'sunburst'} />
        </Card>
      </Page.Content>
    </Page>
  );
}

function ChartToggle({
  selectedView,
  setSelectedView,
}: {
  selectedView: ChartType;
  setSelectedView: (view: ChartType) => void;
}) {
  return (
    <div className="mb-6 flex h-[100px] flex-1 flex-row divide-x overflow-x-scroll rounded-t-xl border-b bg-neutral-50">
      <button
        className={cn(
          'text-gray-1000 flex min-w-[220px] flex-shrink-0 cursor-pointer items-center border-b-2 border-b-transparent px-4 py-4 focus:outline-none group-[.enable-vertical]:lg:border-b-0 group-[.enable-vertical]:lg:border-l-2 group-[.enable-vertical]:lg:border-l-transparent group-[.enable-vertical]:lg:focus:border-l-gray-600',
          selectedView === 'treemap' && toggleActiveClass,
        )}
        onClick={() => setSelectedView('treemap')}
      >
        <p className="text-md font-medium">Treemap Chart</p>
      </button>
      <button
        className={cn(
          'text-gray-1000 border-b-gray-1000 group-[.enable-vertical]:lg:border-l-gray-1000 flex min-w-[220px] flex-shrink-0 cursor-pointer items-center !border-r border-b-2 border-b-transparent px-4 py-4 focus:outline-none group-[.enable-vertical]:lg:border-b-0 group-[.enable-vertical]:lg:border-l-2',
          selectedView === 'sunburst' && toggleActiveClass,
        )}
        onClick={() => setSelectedView('sunburst')}
      >
        <p className="text-md font-medium">Sunburst Chart</p>
      </button>
    </div>
  );
}

interface ChartContentProps {
  show: boolean;
}

function TreemapChartContent({ show }: ChartContentProps) {
  const MAX_LEAF_DEPTH = 6;
  const [leafDepth, setLeafDepth] = useState(MAX_LEAF_DEPTH);
  const debouncedLeafDepth = useDebounce(leafDepth, 250);

  return (
    <CardContent className={cn(show ? 'flex' : 'hidden', 'flex-col gap-4')}>
      <CardDescription>
        This visualization shows which input files were placed into each output
        file in the bundle. Click on a node to expand and focus it.
      </CardDescription>
      <Chart
        type="treemap"
        className="bg-neutral-50"
        data={metafile}
        options={useMemo(
          () => ({
            leafDepth:
              debouncedLeafDepth === MAX_LEAF_DEPTH
                ? undefined
                : debouncedLeafDepth,
          }),
          [debouncedLeafDepth],
        )}
      />
      <div className="flex items-center space-x-2">
        <Slider
          step={1}
          min={1}
          max={MAX_LEAF_DEPTH}
          defaultValue={[MAX_LEAF_DEPTH]}
          className="h-[50px] w-[60%]"
          onValueChange={([value]) => setLeafDepth(value)}
        />
        <Label>{leafDepth === MAX_LEAF_DEPTH ? 'All' : leafDepth}</Label>
      </div>
    </CardContent>
  );
}

function SunburstChartContent({ show }: ChartContentProps) {
  return (
    <CardContent className={cn(show ? 'flex' : 'hidden', 'flex-col gap-4')}>
      <CardDescription>
        This visualization shows how much space each input file takes up in the
        final bundle. Input files that take up 0 bytes have been completely
        eliminated by tree-shaking.
      </CardDescription>
    </CardContent>
  );
}
