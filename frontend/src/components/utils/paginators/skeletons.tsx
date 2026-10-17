export function PaginatorSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
      <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />

      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      </div>

      <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}
