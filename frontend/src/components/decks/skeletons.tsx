export function DeckRowSkeleton() {
  return (
    <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="space-y-2 pr-8">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-6 w-32 animate-pulse rounded bg-muted" />

        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="absolute right-2 top-2 h-8 w-8 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
