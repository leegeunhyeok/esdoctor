import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <div className="mx-auto w-full max-w-[1200px] px-8 pt-8 pb-[100px]">
        {children}
      </div>
    </TooltipProvider>
  );
}

Page.Header = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h1 className={cn('mb-8 text-3xl font-bold', className)}>{children}</h1>
  );
};

Page.Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
};
