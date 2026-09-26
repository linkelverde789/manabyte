import { DeckHeaderSkeleton } from "#/components/deckCards/skeletons";

import { useBulkCreateDeckCard } from "#/features/deckCards/hooks";

import { useDeck } from "#/features/decks/hooks";

import { createFileRoute, Link } from "@tanstack/react-router";

import { ArrowLeft } from "lucide-react";

import { ImportDialog } from "#/components/deckCards/importDialog";
import DeckBody from "#/components/decks/SomeTabs";

export const Route = createFileRoute("/_authenticated/decks/$deckId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { deckId } = Route.useParams();

  const { data: deck, isLoading: isLoadingDeck } = useDeck(deckId);

  const { mutateAsync: bulkCreateDeckCard } = useBulkCreateDeckCard(deckId);

  console.log(deck);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <Link
        to="/decks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All decks
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {isLoadingDeck ? (
            <DeckHeaderSkeleton />
          ) : (
            <>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">
                {deck?.format ?? "Unknown format"}
              </div>

              <h1 className="truncate text-3xl font-semibold tracking-tight">
                {deck?.name ?? "Untitled deck"}
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {deck?.card_count ?? 0} cards
              </p>
            </>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <ImportDialog
            title={`Paste a list into ${deck?.name}`}
            description="Import cards from a decklist. One card per line."
            confirmLabel="Add to deck"
            onConfirm={async (rows) => {
              const data = rows.map((row) => ({
                scryfall_id: row.card.id,
                quantity: row.quantity,
              }));

              await bulkCreateDeckCard(data);
            }}
          />
        </div>
      </div>

      {!isLoadingDeck && <DeckBody deck={deck!} />}
    </div>
  );
}
