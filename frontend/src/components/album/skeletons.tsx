function AlbumCardSkeleton() {
  return (
    <div className="group flex flex-col items-center gap-1.5">
      <div className="aspect-[488/680] w-full animate-pulse rounded-xl border border-border bg-muted/40 shadow-md" />

      <div className="flex w-full items-center justify-between px-0.5">
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        <div className="h-3 w-6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function SetHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-md">
          <div className="h-8 w-10 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function SetProgressSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}

function SetPaginatorSkeleton() {
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

export function SetAlbumSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 px-4 py-10"
      aria-busy="true"
      aria-label="Loading set album"
    >
      <SetHeaderSkeleton />

      <SetProgressSkeleton />

      <SetPaginatorSkeleton />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <AlbumCardSkeleton key={index} />
        ))}
      </div>

      <SetPaginatorSkeleton />
    </div>
  );
}

function SetListItemSkeleton() {
  return (
    <li className="flex items-center gap-2 px-3 py-2">
      <div className="h-4 w-4 animate-pulse rounded bg-muted" />

      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="ml-auto h-3 w-8 animate-pulse rounded bg-muted" />
    </li>
  );
}

export function AlbumIndexSkeleton() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-4 px-4 py-16"
      aria-busy="true"
      aria-label="Loading set albums"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-44 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Search + list */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Search input */}
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />

        {/* Sets list */}
        <ul className="mt-4 max-h-80 overflow-hidden rounded-md border">
          {Array.from({ length: 10 }).map((_, index) => (
            <SetListItemSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}
