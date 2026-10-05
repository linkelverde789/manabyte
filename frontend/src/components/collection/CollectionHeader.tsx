export function CollectionHeader({
  folderCount,
  isLoading,
}: {
  folderCount: number;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">My collection</h1>
        <div className="mt-3 h-4 w-40 animate-pulse rounded bg-muted"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">My collection</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {folderCount} folders.
      </p>
    </div>
  );
}
