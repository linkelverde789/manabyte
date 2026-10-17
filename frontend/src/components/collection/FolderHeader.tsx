import { useGetFolderStats } from "#/features/stats/hooks";
import { CollectionHeader } from "./CollectionHeader";

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
