import {
  useGetCollectionStats,
  useGetFolderStats,
} from "#/features/stats/hooks";
import { ImportDialog } from "../deckCards/importDialog";

export function FolderHeader({
  onImport,
  folderId,
}: {
  onImport: (rows: any[]) => Promise<void>;
  folderId: number;
}) {
  const { data: folderStats, isLoading } = useGetFolderStats(folderId);

  if (!folderStats || isLoading) {
    return;
  }

  return (
    <CollectionHeader
      price={folderStats?.price}
      entries={folderStats.entries}
      cards={folderStats.cards}
      name={folderStats.folder_name}
      onImport={onImport}
    />
  );
}

export function CompleteCollectionHeader({
  onImport,
}: {
  onImport: (rows: any[]) => Promise<void>;
}) {
  const { data: collectionStats, isLoading } = useGetCollectionStats();

  if (!collectionStats || isLoading) return;

  return (
    <CollectionHeader
      price={collectionStats?.price}
      entries={collectionStats.entries}
      cards={collectionStats.cards}
      name={"Collection"}
      onImport={onImport}
    />
  );
}

export function CollectionHeader({
  price,
  entries,
  cards,
  name,
  onImport,
}: {
  price: number;
  entries: number;
  cards: number;
  name: string;
  onImport: (rows: any[]) => Promise<void>;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {cards} cards · {entries} entries
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportDialog
            title="Paste a list into collection"
            description="Import cards from a decklist. One card per line."
            confirmLabel="Add to collection"
            onConfirm={onImport}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Collection value
        </p>
        <p className="text-2xl font-semibold text-primary">${price}</p>
      </div>
    </div>
  );
}
