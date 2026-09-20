import CardRow from "#/components/deckCards/cardRow";

import EmptyDeck from "#/components/deckCards/emptyDeck";

import {
  CardRowSkeleton,
  DeckHeaderSkeleton,
} from "#/components/deckCards/skeletons";

import {
  useBulkCreateDeckCard,
  useCreateDeckCard,
  useDeckCards,
} from "#/features/deckCards/hooks";

import { useDeck } from "#/features/decks/hooks";

import { useLoadCollection } from "#/features/scryfall/hooks";

import type { ScryfallCard } from "#/features/scryfall/types";

import { createFileRoute, Link } from "@tanstack/react-router";

import { ArrowLeft } from "lucide-react";

import { memo, useEffect, useMemo, useState } from "react";
import { ImportDialog } from "#/components/deckCards/importDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "#/components/ui/tabs";
import CardSearch from "#/components/deckCards/cardSearch";
import type { CreateDeckCardData } from "#/features/deckCards/types";
import { groupCardsByType } from "#/tmp/utils";

export const Route = createFileRoute("/_authenticated/decks/$deckId")({
  component: RouteComponent,
});

function RouteComponent() {
  const [tab, setTab] = useState<"main" | "search">("main");
  const { deckId } = Route.useParams();

  const { data: deck, isLoading: isLoadingDeck } = useDeck(deckId);

  const { data: cards, isLoading: isLoadingCards } = useDeckCards(deckId);

  const createDeckCard = useCreateDeckCard(deckId);

  function handleCreate(data: CreateDeckCardData) {
    createDeckCard.mutate({
      scryfall_id: data.scryfall_id,
      quantity: data.quantity,
    });
  }

  const {
    mutate: loadCollection,
    data: results,
    isPending: isLoadingCollection,
    reset: resetCollection,
  } = useLoadCollection();
  const { mutateAsync: bulkCreateDeckCard } = useBulkCreateDeckCard(deckId);

  const [collection, setCollection] = useState<Record<string, ScryfallCard>>(
    {},
  );

  const missingIds = useMemo(() => {
    return (
      cards
        ?.map((card) => card.scryfall_id)
        .filter((id) => !collection[id])
        .map((id) => ({ id })) ?? []
    );
  }, [cards, collection]);

  useEffect(() => {
    if (missingIds.length === 0) {
      return;
    }

    loadCollection(missingIds);
  }, [missingIds, loadCollection]);

  useEffect(() => {
    if (!results?.data) {
      return;
    }

    setCollection((previous) => {
      const next = { ...previous };

      for (const card of results.data) {
        next[card.id] = card;
      }

      return next;
    });

    resetCollection();
  }, [results, resetCollection]);

  const deckRows = useMemo(() => {
    return (
      cards?.flatMap((dataCard) => {
        const card = collection[dataCard.scryfall_id];

        if (!card) {
          return [];
        }

        return [
          {
            card,
            dataCard,
          },
        ];
      }) ?? []
    );
  }, [cards, collection]);

  const isLoading =
    isLoadingDeck ||
    isLoadingCards ||
    isLoadingCollection ||
    missingIds.length > 0;

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

      <Tabs
        value={tab}
        onValueChange={(value) => {
          setTab(value as "main" | "search");
        }}
      >
        <TabsList className="flex-wrap">
          <TabsTrigger value="main">
            Main deck (
            {cards?.reduce((sum, card) => sum + card.quantity, 0) ?? 0})
          </TabsTrigger>

          <TabsTrigger value="search">Search cards</TabsTrigger>
        </TabsList>
        <TabsContent value="main" className="mt-6">
          {isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <CardRowSkeleton key={index} />
              ))}
            </div>
          )}

          {!isLoading && deckRows.length === 0 && <EmptyDeck />}

          {!isLoading && deckRows.length > 0 && (
            <div className="space-y-6">
              {Object.entries(groupCardsByType(deckRows)).map(
                ([type, rows]) => (
                  <div key={type}>
                    <h2 className="text-lg font-semibold mb-2">{type}</h2>
                    <div className="space-y-2">
                      {rows.map(({ card, dataCard }) => (
                        <MemoizedCardRow
                          key={dataCard.id}
                          card={card}
                          dataCard={dataCard}
                          deckId={deckId}
                        />
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </TabsContent>
        <TabsContent value="search" className="mt-6">
          <CardSearch onCreate={handleCreate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const MemoizedCardRow = memo(CardRow);
