import { CardRowSkeleton } from "../deckCards/skeletons";
import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "../deckCards/cardRow";
import { memo, useEffect, useMemo, useState } from "react";
import type { Deck } from "#/features/decks/types";
import { groupCardsByType } from "#/lib/utils";
import type { ScryfallCard } from "#/features/scryfall/types";
import { useLoadCollection } from "#/features/scryfall/hooks";
import { useDeckCards } from "#/features/deckCards/hooks";

export function DeckContent({ deck }: { deck: Deck }) {
  const { data: cards, isLoading: isLoadingCards } = useDeckCards(deck.id);
  const [collection, setCollection] = useState<Record<string, ScryfallCard>>(
    {},
  );

  const {
    mutate: loadCollection,
    data: results,
    reset: resetCollection,
    isPending: isLoadingCollection,
  } = useLoadCollection();

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

  if (isLoadingCards || isLoadingCollection) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <CardRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoadingCards && deckRows.length == 0) {
    return <EmptyDeck />;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupCardsByType(deckRows)).map(([type, rows]) => (
        <div key={type}>
          <h2 className="text-lg font-semibold mb-2">{type}</h2>
          <div className="space-y-2">
            {rows.map(({ card, dataCard }) => (
              <MemoizedCardRow
                key={dataCard.id}
                card={card}
                dataCard={dataCard}
                deckId={deck.id}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
const MemoizedCardRow = memo(CardRow);
