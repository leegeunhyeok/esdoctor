import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import { SettingsIcon } from 'lucide-react';

export interface TreemapChartControlModalProps {
  initialOptions: TreemapChartOptions;
  onApply: (options: TreemapChartOptions) => void;
}

export interface TreemapChartOptions {
  leafDepth?: number;
  includeFilter?: string;
  excludeFilter?: string;
}

const MAX_LEAF_DEPTH = 6;

export function TreemapChartControlModal({
  initialOptions,
  onApply,
}: TreemapChartControlModalProps) {
  const [includeFilter, setIncludeFilter] = useState(
    initialOptions.includeFilter ?? '',
  );
  const [excludeFilter, setExcludeFilter] = useState(
    initialOptions.excludeFilter ?? '',
  );
  const [leafDepth, setLeafDepth] = useState(
    initialOptions.leafDepth ?? MAX_LEAF_DEPTH,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Controls</DialogTitle>
          <DialogDescription>
            Make changes to treemap chart options here. Click apply when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="include-filter" className="text-right">
              Include
            </Label>
            <Input
              id="include-filter"
              value={includeFilter}
              placeholder="Enter regex to filter data..."
              className="col-span-3"
              onChange={(event) => {
                setIncludeFilter(event.target.value);
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="exclude-filter" className="text-right">
              Exclude
            </Label>
            <Input
              id="exclude-filter"
              value={excludeFilter}
              placeholder="Enter regex to filter data..."
              className="col-span-3"
              onChange={(event) => {
                setExcludeFilter(event.target.value);
              }}
            />
          </div>
          <div className="grid-row-4 grid items-center">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="depth" className="text-right">
                Depth
              </Label>
              <Slider
                id="depth"
                value={[leafDepth]}
                onValueChange={([value]) => setLeafDepth(value)}
                className="col-span-3"
                min={1}
                max={MAX_LEAF_DEPTH}
              />
            </div>
            <Label className="mt-2 text-right text-xs">
              {leafDepth === MAX_LEAF_DEPTH ? 'Unlimited' : leafDepth}
            </Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              onClick={() => {
                onApply({
                  leafDepth:
                    leafDepth === MAX_LEAF_DEPTH ? undefined : leafDepth,
                  includeFilter,
                  excludeFilter,
                });
              }}
            >
              Apply changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
