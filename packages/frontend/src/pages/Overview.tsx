import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Overview() {
  return (
    <div className="mx-auto mt-8 w-full px-8 py-4">
      <h1 className="mb-6 text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
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
      </div>
    </div>
  );
}
