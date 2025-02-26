import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatInteger } from '@/src/utils/format';
import { Blocks, CircleX, TriangleAlert } from 'lucide-react';
import { BuildConfigModal } from './build-config-modal';
import { generatedWarnings } from '@/src/utils/generate-warnings';

const moduleCount = Object.keys(
  window.__esdoctorDataSource.metafile.inputs,
).length;
const messageCount = window.__esdoctorDataSource.alerts.reduce(
  (prev, { type }) =>
    type === 'error'
      ? { ...prev, errors: prev.errors + 1 }
      : { ...prev, warnings: prev.warnings + 1 },
  { errors: 0, warnings: generatedWarnings.length },
);

export function ProjectOverviewCart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="mb-0">Project overview</CardTitle>
        <BuildConfigModal />
      </CardHeader>
      <Separator orientation="horizontal" />
      <CardContent>
        <div className="flex h-[80px] flex-row gap-4 pt-6">
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <CircleX className="text-red-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-gray-500">Errors</p>
              <p className="text-2xl font-bold">
                {formatInteger(messageCount.errors)}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="-mt-6 h-[105px]" />
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <TriangleAlert className="text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-gray-500">Warnings</p>
              <p className="text-2xl font-bold">
                {formatInteger(messageCount.warnings)}
              </p>
            </div>
          </div>
          <Separator orientation="vertical" className="-mt-6 h-[105px]" />
          <div className="flex flex-1 flex-row items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Blocks className="text-blue-500" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold text-gray-500">Modules</p>
              <p className="text-2xl font-bold">{formatInteger(moduleCount)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
