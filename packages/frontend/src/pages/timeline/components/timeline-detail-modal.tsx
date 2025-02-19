import { Timer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Code } from '@/src/components/code';
import { formatNumberWithDecimal } from '@/src/utils/format';
import { toJSON } from '@/src/utils/to-json';
import type { TimelineData } from '../types';

const CODE_MAX_LENGTH = 1024 * 20;

export interface TimelineDetailModalProps {
  open: boolean;
  details: Pick<TimelineData, 'start' | 'end' | 'data' | 'code'> | null;
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
      console.warn('Code is too long to highlight');

      return (
        <pre
          className="block text-xs"
          style={{
            background: 'rgb(250, 250, 250)',
            color: 'rgb(56, 58, 66)',
            fontFamily:
              '"Fira Code", "Fira Mono", Menlo, Consolas, "DejaVu Sans Mono", monospace',
            direction: 'ltr',
            textAlign: 'left',
            whiteSpace: 'pre',
            wordSpacing: 'normal',
            wordBreak: 'normal',
            lineHeight: '1.5',
            tabSize: '2',
            hyphens: 'none',
            padding: '1em',
            margin: '0px',
            overflow: 'auto visible',
            borderRadius: '0.3em',
          }}
        >
          {code}
        </pre>
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
        {renderCode(
          details?.data ? toJSON(details.data) : '// No data',
          'json',
        )}
        {details?.code ? renderCode(details.code, 'javascript') : null}
      </DialogContent>
    </Dialog>
  );
}
