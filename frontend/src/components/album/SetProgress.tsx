export function SetProgress({
  userCollectionCount,
  setCollectionCount,
}: {
  userCollectionCount: number;
  setCollectionCount: number;
}) {
  const percent = setCollectionCount
    ? Math.round((userCollectionCount / setCollectionCount) * 100)
    : 0;
  return (
    <div className="rounded-xl border border-border bg-card px-5 py-5 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Collection progress
          </p>

          <p className="text-3xl font-semibold text-primary">
            {userCollectionCount} / {setCollectionCount}{" "}
            <span className="text-base font-normal text-muted-foreground">
              unique cards
            </span>
          </p>
        </div>

        <div className="flex gap-6 text-right">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Owned
            </p>

            <p className="text-lg font-semibold text-emerald-400">
              {userCollectionCount}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Missing
            </p>

            <p className="text-lg font-semibold text-zinc-400">
              {Math.max(setCollectionCount - userCollectionCount, 0)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Completed
            </p>

            <p className="text-lg font-semibold text-amber-300">{percent}%</p>
          </div>
        </div>
      </div>

      <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
