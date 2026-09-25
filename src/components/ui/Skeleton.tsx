import { cn } from '@/lib/utils/cn';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-emerald-950/10 dark:bg-emerald-100/10',
        className,
      )}
      {...props}
    />
  );
}
