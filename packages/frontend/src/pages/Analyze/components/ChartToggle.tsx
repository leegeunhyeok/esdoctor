import { cn } from '@/lib/utils';
import type { ChartType } from '@/src/components/Chart';

const TOGGLE_ACTIVE_CLASSES = 'border-b-gray-600 bg-white';

export function ChartToggle({
  selectedView,
  setSelectedView,
}: {
  selectedView: ChartType;
  setSelectedView: (view: ChartType) => void;
}) {
  return (
    <div className="mb-6 flex h-[100px] flex-1 flex-row divide-x overflow-x-scroll rounded-t-xl border-b bg-neutral-50">
      <button
        className={cn(
          'text-gray-1000 flex min-w-[220px] flex-shrink-0 cursor-pointer items-center border-b-2 border-b-transparent px-4 py-4 focus:outline-none group-[.enable-vertical]:lg:border-b-0 group-[.enable-vertical]:lg:border-l-2 group-[.enable-vertical]:lg:border-l-transparent group-[.enable-vertical]:lg:focus:border-l-gray-600',
          selectedView === 'treemap' && TOGGLE_ACTIVE_CLASSES,
        )}
        onClick={() => setSelectedView('treemap')}
      >
        <p className="text-md font-medium">Treemap Chart</p>
      </button>
      <button
        className={cn(
          'text-gray-1000 border-b-gray-1000 group-[.enable-vertical]:lg:border-l-gray-1000 flex min-w-[220px] flex-shrink-0 cursor-pointer items-center !border-r border-b-2 border-b-transparent px-4 py-4 focus:outline-none group-[.enable-vertical]:lg:border-b-0 group-[.enable-vertical]:lg:border-l-2',
          selectedView === 'sunburst' && TOGGLE_ACTIVE_CLASSES,
        )}
        onClick={() => setSelectedView('sunburst')}
      >
        <p className="text-md font-medium">Sunburst Chart</p>
      </button>
    </div>
  );
}
