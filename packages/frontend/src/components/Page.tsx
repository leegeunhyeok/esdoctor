import { cn } from '@/lib/utils';

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-8 pt-8 pb-4">
      {children}
    </div>
  );
}

Page.Header = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="mb-8 text-3xl font-bold">{children}</h1>;
};

Page.Content = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('flex flex-col gap-6', className)}>{children}</div>;
};
