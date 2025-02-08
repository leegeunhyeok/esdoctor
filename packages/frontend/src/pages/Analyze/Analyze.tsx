import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChartType } from '../../components/Chart';
import { Page } from '../../components/Page';
import { loadMetafile } from '../../utils/loadMetafile';
import { TreemapChart } from './components/TreemapChart';
import { SunburstChart } from './components/SunburstChart';
import { ChartToggle } from './components/ChartToggle';

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
          <TreemapChart data={metafile} show={selectedView === 'treemap'} />
          <SunburstChart data={metafile} show={selectedView === 'sunburst'} />
        </Card>
      </Page.Content>
    </Page>
  );
}
