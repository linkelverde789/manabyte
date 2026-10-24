import { useGetFolderStats } from "#/features/stats/hooks";
import type { ResolvedRow } from "../deckCards/importDialog";
import { CollectionHeader } from "./CollectionHeader";

export function FolderHeader({
  onImport,
  folderId,
}: {
  onImport: (rows: ResolvedRow[]) => Promise<void>;
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
