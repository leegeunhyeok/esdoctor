import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Page } from '../components/Page';

export function Overview() {
  return (
    <Page>
      <Page.Header>Overview</Page.Header>
      <Page.Content>
        <section className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Deployments</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Total: 24</p>
              <p>This week: 3</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Traffic</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Requests: 1.2M</p>
              <p>Bandwidth: 5.7 GB</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Avg. Response Time: 84ms</p>
              <p>P95 Response Time: 210ms</p>
            </CardContent>
          </Card>
        </section>
      </Page.Content>
    </Page>
  );
}
