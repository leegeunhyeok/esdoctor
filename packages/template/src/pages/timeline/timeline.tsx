import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '@/src/components/page';
import { TimelineChart } from './components/timeline-chart';
import { TimelineTraceTable } from './components/timeline-trace-table';
import { createTimelineData } from './helpers/create-timeline-data';
import { downsampleTimelineData } from './helpers/downsample-timeline-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DurationStackedBarChart } from './components/duration-stacked-bar-chart';
import { Separator } from '@/components/ui/separator';

const data = createTimelineData(window.__esdoctorDataSource.traceList);
const downsampledData = downsampleTimelineData(data.timelineData);

export function Timeline() {
  return (
    <Page>
      <Page.Header>Timeline</Page.Header>
      <Page.Content>
        <Tabs defaultValue="traces">
          <div className="flex items-center justify-between gap-2">
            <TabsList>
              <TabsTrigger value="traces">Traces</TabsTrigger>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="traces"
            className="hidden data-[state=active]:block"
            forceMount
          >
            <Card>
              <CardHeader>
                <CardTitle>Traces list</CardTitle>
              </CardHeader>
              <CardContent className="-mt-12 flex flex-col gap-4">
                <TimelineTraceTable data={data.timelineData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent
            value="visualization"
            className="hidden flex-col gap-4 data-[state=active]:flex"
            forceMount
          >
            <Card>
              <CardHeader>
                <CardTitle>Total duration</CardTitle>
              </CardHeader>
              <CardContent>
                <DurationStackedBarChart
                  data={data.timelineData}
                  traceNames={data.traceNames}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Timeline visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <TimelineChart
                  data={downsampledData.seriesData}
                  min={data.min}
                  max={data.max}
                  traceNames={data.traceNames}
                  traceNameIndexMap={data.traceNameIndexMap}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Page.Content>
    </Page>
  );
}
