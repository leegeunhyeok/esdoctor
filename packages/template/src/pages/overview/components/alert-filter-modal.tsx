import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import { DialogClose } from '@radix-ui/react-dialog';
import { FilterIcon } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export interface AlertFilterModalProps {
  onApply: (options: AlertFilterOptions) => void;
}

export interface AlertFilterOptions {
  warnings: boolean;
  errors: boolean;
}

export function AlertFilterModal({ onApply }: AlertFilterModalProps) {
  const [values, setValues] = useState<AlertFilterOptions>({
    warnings: true,
    errors: true,
  });

  return (
    <Dialog modal>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-4">
          <FilterIcon />
          <Label className="cursor-pointer">Filter</Label>
        </Button>
      </DialogTrigger>
      <DialogContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:max-w-[425px] sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Filter</DialogTitle>
          <DialogDescription>
            Make changes to alert filter options here. Click apply when you're
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="warnings" className="text-right">
              Warnings
            </Label>
            <Checkbox
              id="warnings"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              checked={values.warnings}
              onCheckedChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  warnings: checked === 'indeterminate' ? true : checked,
                }))
              }
            />
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="errors" className="text-right">
              Errors
            </Label>
            <Checkbox
              id="errors"
              className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              checked={values.errors}
              onCheckedChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  errors: checked === 'indeterminate' ? true : checked,
                }))
              }
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="submit" onClick={() => onApply(values)}>
              Apply changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
