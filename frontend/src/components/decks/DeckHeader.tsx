import type { Deck } from "#/features/decks/types";
import { DeckHeaderSkeleton } from "../deckCards/skeletons";

export default function DeckHeader({
  deck,
  isLoading,
}: {
  deck: Deck;
  isLoading: boolean;
}) {
  return (
    <div className="min-w-0">
      {isLoading ? (
        <DeckHeaderSkeleton />
      ) : (
        <>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {deck.format ?? "Unknown format"}
          </div>

          <h1 className="truncate text-3xl font-semibold tracking-tight">
            {deck.name ?? "Untitled deck"}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {deck.card_count ?? 0} cards
          </p>
        </>
      )}
    </div>
  );
}
