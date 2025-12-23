import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-[rgb(var(--bg-tertiary))]',
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

// Preset skeleton layouts
export function TransactionSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Loading transactions">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 border border-[rgba(var(--border),var(--border-opacity))] rounded-lg"
        >
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
      <span className="sr-only">Loading transactions...</span>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="card-glass rounded-xl p-6"
      role="status"
      aria-label="Loading card"
    >
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-full" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div
      className="card-glass rounded-xl p-6"
      role="status"
      aria-label="Loading statistics"
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-5 rounded" />
      </div>
      <Skeleton className="h-10 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
      <span className="sr-only">Loading statistics...</span>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading chart"
    >
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <span className="sr-only">Loading chart...</span>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading table">
      <div className="grid grid-cols-4 gap-4 pb-3 border-b border-[rgba(var(--border),var(--border-opacity))]">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
      <span className="sr-only">Loading table data...</span>
    </div>
  );
}
