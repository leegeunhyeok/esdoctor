import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Box, Cpu, DraftingCompass, Folder } from 'lucide-react';

const environment = window.$$dataSource.environment;

export function EnvironmentCart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Environment</CardTitle>
      </CardHeader>
      <Separator orientation="horizontal" />
      <CardContent>
        <div className="flex flex-row gap-4 pt-6">
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-bold text-gray-500">Platform</p>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center rounded-full bg-gray-100 p-2">
                <Box />
              </div>
              <p>{environment.platform}</p>
            </div>
          </div>
          <Separator orientation="vertical" className="-my-6 h-[96px]" />
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-bold text-gray-500">CPU</p>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center rounded-full bg-gray-100 p-2">
                <Cpu />
              </div>
              <p>
                {Object.entries(environment.cpu).reduce(
                  (acc, [cpuName, coreCount]) => {
                    return `${acc}\n${cpuName} (${coreCount})`;
                  },
                  '',
                )}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="-my-6 h-[96px]" />
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-xs font-bold text-gray-500">Architecture</p>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center rounded-full bg-gray-100 p-2">
                <DraftingCompass />
              </div>
              <p>{environment.arch}</p>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator orientation="horizontal" />
      <CardFooter className="flex-center flex justify-between pt-6">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-8 w-8 items-center rounded-full bg-gray-100 p-2">
            <Folder />
          </div>
          <p className="text-xs leading-[20px] font-bold text-gray-500">
            Working directory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p>{environment.cwd}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
