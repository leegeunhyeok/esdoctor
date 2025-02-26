import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Box, Cpu, DraftingCompass, Folder } from 'lucide-react';

const environment = window.__esdoctorDataSource.environment;

export function EnvironmentCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Environment</CardTitle>
      </CardHeader>
      <Separator orientation="horizontal" />
      <CardContent className="px-6 py-4">
        <div className="flex flex-row gap-4">
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Box />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Platform</p>
              <p>{environment.platform}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="-my-[17px] h-[90px]" />
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Cpu />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">CPU</p>
              <p>
                {Object.entries({
                  ...environment.cpu,
                }).reduce((acc, [cpuName, coreCount]) => {
                  return `${acc}\n${cpuName} (${coreCount})`;
                }, '')}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="-my-[17px] h-[90px]" />
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <DraftingCompass />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500">Architecture</p>
              <p>{environment.arch}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator orientation="horizontal" />
      <CardFooter className="flex-center flex justify-between pt-6">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Folder size={20} strokeWidth={2.4} />
          </div>
          <p className="text-xs leading-[20px] font-bold text-gray-500">
            Working directory
          </p>
        </div>
        <div className="flex max-w-[480px] items-center">
          <p className="overflow-hidden text-ellipsis">{environment.cwd}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
