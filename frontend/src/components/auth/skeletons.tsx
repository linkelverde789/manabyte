export function AuthSkeleton() {
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="h-9 w-56 animate-pulse rounded-lg bg-muted" />

      <div className="mt-8">
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1">
          <div className="h-9 animate-pulse rounded-md bg-muted" />
          <div className="h-9 animate-pulse rounded-md bg-muted" />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
          </div>

          <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
