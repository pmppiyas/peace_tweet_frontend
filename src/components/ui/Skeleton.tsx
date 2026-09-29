import { cn } from '@/lib/utils/cn';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-primary-900/10 dark:bg-primary-100/10',
        className,
      )}
      {...props}
    />
  );
}
