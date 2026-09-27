import { ImportDialog } from "../deckCards/importDialog";

export function FolderHeader({
  folderName,
  total,
  entries,
  onImport,
}: {
  folderName?: string;
  total: number;
  entries: number;
  onImport: (rows: any[]) => Promise<void>;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{folderName}</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          {total} cards · {entries} entries
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <ImportDialog
          title="Paste a list into collection"
          description="Import cards from a decklist. One card per line."
          confirmLabel="Add to collection"
          onConfirm={onImport}
        />
      </div>
    </div>
  );
}
