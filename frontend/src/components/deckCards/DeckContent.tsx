import { CardRowSkeleton } from "../deckCards/skeletons";
import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "../deckCards/cardRow";
import { memo, useMemo } from "react";
import type { Deck } from "#/features/decks/types";
import { groupCardsByType } from "#/lib/utils";

import { useDeckCards } from "#/features/deckCards/hooks";

export function DeckContent({ deck }: { deck: Deck }) {
  const { data: cards, isLoading: isLoadingCards } = useDeckCards(deck.id);

  const deckRows = useMemo(() => {
    return (
      cards?.flatMap((dataCard) => {
        const card = dataCard.card;

        return [{ card, dataCard }];
      }) ?? []
    );
  }, [cards]);

  if (isLoadingCards) {
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
            {rows.map((card) => (
              <MemoizedCardRow
                key={card.dataCard.id}
                card={card.card}
                dataCard={card.dataCard}
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
