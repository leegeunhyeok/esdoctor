import { AlertCircle, Timer } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Code } from '@/src/components/code';
import { formatNumberWithDecimal } from '@/src/utils/format';

const CODE_MAX_LENGTH = 1024 * 20;

export interface TimelineDetailModalProps {
  open: boolean;
  details: {
    start: number;
    end: number;
    data?: string;
    code?: string;
  } | null;
  onOpenChange: (open: boolean) => void;
}

export function TimelineDetailModal({
  open,
  details,
  onOpenChange,
}: TimelineDetailModalProps) {
  const start = details?.start ?? 0;
  const end = details?.end ?? 0;
  const duration = end - start;

  function renderCode(code: string, language: string) {
    if (code.length > CODE_MAX_LENGTH) {
      console.log(code);

      return (
        <>
          <Code
            code={`// Data is too long to display.`}
            language="javascript"
          />
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The data is too long to display. Show console instead.
            </AlertDescription>
          </Alert>
        </>
      );
    }

    return <Code code={code} language={language} />;
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[75%] w-full overflow-y-auto sm:max-w-[750px]">
        <DialogHeader>
          <DialogTitle>Trace details</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-1">
          <Timer className="h-4 w-4" />
          <p>Duration: {formatNumberWithDecimal(duration)}ms</p>
          <span className="text-muted-foreground">
            ({formatNumberWithDecimal(start)}ms~{formatNumberWithDecimal(end)}
            ms)
          </span>
        </div>
        {renderCode(details?.data ?? '// No data', 'json')}
        {details?.code ? renderCode(details.code, 'javascript') : null}
      </DialogContent>
    </Dialog>
  );
}
