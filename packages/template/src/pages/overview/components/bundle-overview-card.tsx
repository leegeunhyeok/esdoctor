import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useTab } from '@/src/hooks/use-tab';
import { bytesToText } from '@/src/utils/filesize';
import { formatInteger, formatNumberWithDecimal } from '@/src/utils/format';
import { ChevronRight, HardDrive } from 'lucide-react';

const metafile = window.__esdoctorDataSource.metafile;
const modules = window.__esdoctorDataSource.moduleStatus;
const outputs = Object.entries(metafile.outputs).map(([path, output]) => ({
  bytes: output.bytes,
  filename: path.split('/').pop(),
}));
const totalSize = outputs.reduce((acc, output) => acc + output.bytes, 0);
const modulesTotal = Object.values(modules).reduce(
  (prev, value) => prev + value,
  0,
);

const moduleStatus = [
  { label: 'ESM', value: modules.esm },
  { label: 'CJS', value: modules.cjs },
  { label: 'Unknown', value: modules.unknown },
].filter(({ value }) => value > 0);

const toPercentage = (value: number, minLimit = false) => {
  const percentage = (value / modulesTotal) * 100;
  return minLimit ? Math.max(percentage, 1) : percentage;
};

export function BundleOverviewCard() {
  const { setActiveTab } = useTab();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bundle overview</CardTitle>
        <div
          className="flex cursor-pointer items-center gap-2"
          onClick={() => setActiveTab('analyze')}
        >
          <Label className="cursor-pointer text-gray-500">Analyze bundle</Label>
          <ChevronRight size={16} className="cursor-pointer text-gray-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div>
            <div className="grid grid-cols-5 items-center">
              <div className="flex h-10 w-10 items-center rounded-full bg-emerald-100 p-2">
                <HardDrive className="text-emerald-500" />
              </div>
              <div className="col-span-4 flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  <p className="text-xs font-bold text-gray-500">Size</p>
                  <div className="mb-1 flex items-center justify-between">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-2xl font-bold">
                          {bytesToText(totalSize)}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatInteger(totalSize)} bytes</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  {outputs.length} {outputs.length > 1 ? 'Files' : 'File'}
                </p>
              </div>
            </div>
            {outputs.map((output) => (
              <div
                key={output.filename}
                className="grid grid-cols-5 items-center"
              >
                <div />
                <div className="col-span-4 flex flex-row items-center justify-between text-sm text-gray-400">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p>{bytesToText(output.bytes)}</p>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatInteger(output.bytes)} bytes</p>
                    </TooltipContent>
                  </Tooltip>
                  <p>{output.filename}</p>
                </div>
              </div>
            ))}
          </div>
          <Separator />
          {moduleStatus.map(({ label, value }, index) => (
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
                <p>{formatNumberWithDecimal(toPercentage(value))}%</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
