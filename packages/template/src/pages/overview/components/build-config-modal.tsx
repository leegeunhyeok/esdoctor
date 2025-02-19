import { ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Code } from '@/src/components/code';

const buildConfig = JSON.stringify(
  window.__esdoctorDataSource.buildOptions,
  null,
  2,
);

export function BuildConfigModal() {
  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <div className="flex cursor-pointer items-center gap-2">
          <Label className="cursor-pointer text-gray-500">
            Show build config
          </Label>
          <ChevronRight size={16} className="cursor-pointer text-gray-500" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[75%] w-full overflow-y-auto sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Build config</DialogTitle>
        </DialogHeader>
        <Code language="json" code={buildConfig} />
      </DialogContent>
    </Dialog>
  );
}
