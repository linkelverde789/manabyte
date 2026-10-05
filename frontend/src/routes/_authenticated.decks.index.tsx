import DeckRow from "#/components/decks/DeckRow";
import EmptyDecks from "#/components/decks/EmptyDecks";
import NewDeckDialog from "#/components/decks/newDeckDialog";
import { Skeleton } from "#/components/ui/skeleton";
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

export function DeckRowSkeleton() {
  return (
    <div className="relative rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="space-y-2 pr-8">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>

        <div className="h-6 w-32 animate-pulse rounded bg-muted" />

        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="absolute right-2 top-2 h-8 w-8 animate-pulse rounded-md bg-muted" />
    </div>
  );
}
