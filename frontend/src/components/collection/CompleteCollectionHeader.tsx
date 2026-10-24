import { useGetCollectionStats } from "#/features/stats/hooks";
import type { ResolvedRow } from "../deckCards/importDialog";
import { CollectionHeader } from "./CollectionHeader";

export function CompleteCollectionHeader({
  onImport,
}: {
  onImport: (rows: ResolvedRow[]) => Promise<void>;
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
