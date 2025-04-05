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
import { OnLoadResult } from 'esbuild';

const CODE_MAX_LENGTH = 1024 * 20;

export interface TimelineDetailModalProps {
  open: boolean;
  details: Pick<
    TimelineData,
    'start' | 'end' | 'args' | 'options' | 'result' | 'data'
  > | null;
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
  const code = (details?.result as OnLoadResult)?.contents?.toString();

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

  console.log(details);

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
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Options</p>
          {renderCode(
            details?.options ? toJSON(details.options) : '// No options',
            'json',
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Arguments</p>
          {renderCode(
            details?.args ? toJSON(details.args) : '// No arguments',
            'json',
          )}
        </div>
        {code ? (
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold">Transform result</p>
            {renderCode(code, 'javascript')}
          </div>
        ) : null}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Additional data</p>
          {renderCode(
            details?.data ? toJSON(details.data) : '// No additional data',
            'json',
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
