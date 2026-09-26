import DeckRow from "#/components/decks/DeckRow";
import EmptyDecks from "#/components/decks/EmptyDecks";
import NewDeckDialog from "#/components/decks/newDeckDialog";
import { useDecks, useDeleteDeck } from "#/features/decks/hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/decks/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: decks } = useDecks();

  const deleteDeck = useDeleteDeck();
  function handleDeleteDeck(deckId: string) {
    deleteDeck.mutate(deckId);
  }

  if (!decks) {
    return (
      <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No decks yet. Create one, then paste a list or search cards to fill it.
      </p>
    );
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My decks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {decks.length} deck{decks.length === 1 ? "" : "s"} saved.
          </p>
        </div>
        <NewDeckDialog />
      </div>

      {decks.length === 0 ? (
        <EmptyDecks />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            return <DeckRow deck={deck} onDelete={handleDeleteDeck} />;
          })}
        </div>
      )}
    </div>
  );
}
