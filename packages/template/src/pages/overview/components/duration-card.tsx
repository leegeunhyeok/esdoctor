import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTab } from '@/src/hooks/use-tab';
import { formatNumberWithDecimal } from '@/src/utils/format';
import { millisecondsToText } from '@/src/utils/time';
import { ChevronRight, Timer } from 'lucide-react';

const { total: totalDuration, hooks } = window.__esdoctorDataSource.duration;
const { onStart, onResolve, onLoad, onEnd } = hooks;
const totalHookDuration = onStart + onResolve + onLoad + onEnd;
const hookDurations = [
  { label: 'Start', value: onStart },
  { label: 'Resolve', value: onResolve },
  { label: 'Load', value: onLoad },
  { label: 'End', value: onEnd },
];

const toPercentage = (value: number, minLimit = false) => {
  const percentage = (value / totalHookDuration) * 100;
  return minLimit ? Math.max(percentage, 1) : percentage;
};

export function DurationCard() {
  const { setActiveTab } = useTab();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Durations</CardTitle>
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setActiveTab('timeline')}
        >
          <Label className="cursor-pointer text-gray-500">Timeline</Label>
          <ChevronRight size={16} className="cursor-pointer text-gray-500" />
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex flex-col justify-between">
          <div className="grid grid-cols-5 items-center">
            <div className="flex h-10 w-10 items-center rounded-full bg-violet-100 p-2">
              <Timer className="text-violet-500" />
            </div>
            <div className="col-span-4 flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <p className="text-xs font-bold text-gray-500">Total</p>
                <div className="mb-1 flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-2xl font-bold">
                        {millisecondsToText(totalDuration)}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatNumberWithDecimal(totalDuration)}ms</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        {hookDurations.map(({ label, value }, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className="grid grid-cols-5 items-center gap-4">
                <Label className="text-right text-xs">{label}</Label>
                <Progress
                  className="col-span-4"
                  max={100}
                  value={toPercentage(value, true)}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {formatNumberWithDecimal(value)}ms (
                {formatNumberWithDecimal(toPercentage(value))}%)
              </p>
            </TooltipContent>
          </Tooltip>
        ))}
      </CardContent>
    </Card>
  );
}
