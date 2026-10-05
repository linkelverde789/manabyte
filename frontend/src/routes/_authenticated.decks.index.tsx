import DeckRow from "#/components/decks/DeckRow";
import EmptyDecks from "#/components/decks/EmptyDecks";
import NewDeckDialog from "#/components/decks/newDeckDialog";
import { DeckRowSkeleton } from "#/components/decks/skeletons";
import { useDecks, useDeleteDeck } from "#/features/decks/hooks";
import type { Deck } from "#/features/decks/types";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/decks/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: decks, isLoading } = useDecks();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My decks</h1>
          {decks && (
            <p className="mt-1 text-sm text-muted-foreground">
              {decks.length} deck{decks.length === 1 ? "" : "s"} saved.
            </p>
          )}
        </div>
        <NewDeckDialog />
      </div>

      <div className=" grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading || !decks ? (
          Array.from({ length: 5 }).map((_, index) => (
            <DeckRowSkeleton key={index} />
          ))
        ) : (
          <DeckListContent decks={decks} />
        )}
      </div>
    </div>
  );
}

export function DeckListContent({ decks }: { decks: Deck[] }) {
  const deleteDeck = useDeleteDeck();
  function handleDeleteDeck(deckId: number) {
    deleteDeck.mutate(deckId);
  }

  if (decks.length == 0) {
    return <EmptyDecks />;
  }

  return decks.map((deck) => {
    return <DeckRow deck={deck} onDelete={handleDeleteDeck} />;
  });
}
