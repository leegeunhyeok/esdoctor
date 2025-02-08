import { CardContent, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ChartContentProps } from './types';

export function SunburstChart({ show }: ChartContentProps) {
  return (
    <CardContent className={cn(show ? 'flex' : 'hidden', 'flex-col gap-4')}>
      <CardDescription>
        This visualization shows how much space each input file takes up in the
        final bundle. Input files that take up 0 bytes have been completely
        eliminated by tree-shaking.
      </CardDescription>
    </CardContent>
  );
}
