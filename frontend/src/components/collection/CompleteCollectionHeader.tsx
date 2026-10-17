import { useGetCollectionStats } from "#/features/stats/hooks";
import { CollectionHeader } from "./CollectionHeader";

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
