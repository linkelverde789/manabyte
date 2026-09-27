export function CollectionHeader({ folderCount }: { folderCount: number }) {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">My collection</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {folderCount} folders.
      </p>
    </div>
  );
}
