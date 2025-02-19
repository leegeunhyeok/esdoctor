import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertFilterModal } from './alert-filter-modal';
import { Smile } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { generatedWarnings } from '@/src/utils/generate-warnings';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

const alerts = [
  ...window.__esdoctorDataSource.alerts,
  ...generatedWarnings.map((message) => ({
    type: 'warning',
    text: message,
  })),
];

export function AlertsCard() {
  const [filter, setFilter] = useState({ errors: true, warnings: true });

  const filteredAlerts = useMemo(() => {
    return alerts.filter(({ type }) => {
      switch (type) {
        case 'error':
          return filter.errors;
        case 'warning':
          return filter.warnings;
      }
    });
  }, [filter]);
  const alertCount = filteredAlerts.length;

  return (
    <Card>
      <CardHeader className="mb-1 flex flex-row items-center justify-between">
        <CardTitle className="mb-0">
          {alertCount === 0 ? 'Alerts' : `Alerts (${alertCount})`}
        </CardTitle>
        <AlertFilterModal onApply={setFilter} />
      </CardHeader>
      <CardContent>
        {alertCount === 0 ? (
          <div className="my-4 flex flex-col items-center justify-center gap-2">
            <Smile size={20} className="text-gray-500" />
            <p className="text-sm text-gray-500">No alerts found</p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center">
            <div className="flex w-full flex-row items-center justify-between border-b pb-4">
              <Label className="text-sm font-bold text-gray-500">Message</Label>
              <Label className="text-sm font-bold text-gray-500">Type</Label>
            </div>
            {filteredAlerts.map((message, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center justify-between gap-2 border-b py-4 last:border-b-0 last:pb-0"
              >
                <div className="flex flex-col items-start">
                  {'id' in message ? (
                    <p className="text-xs font-bold text-gray-400">
                      {message.id as string}
                    </p>
                  ) : null}
                  <p className="text-sm">{message.text}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    message.type === 'error'
                      ? 'border-red-300 bg-red-100 text-red-500'
                      : 'border-yellow-300 bg-yellow-100 text-yellow-500',
                  )}
                >
                  {message.type === 'error' ? 'Error' : 'Warning'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
