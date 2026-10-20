import { CardRowSkeleton } from "../deckCards/skeletons";
import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "../deckCards/cardRow";
import type { Deck } from "#/features/decks/types";

import { useDeckCards } from "#/features/deckCards/hooks";

export function DeckContent({ deck }: { deck: Deck }) {
  const { data: cards, isLoading: isLoadingCards } = useDeckCards(deck.id);

  if (isLoadingCards) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 7 }).map((_, index) => (
          <CardRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isLoadingCards && cards!.length == 0) {
    return <EmptyDeck />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards!.map((card) => (
        <CardRow
          key={card.id}
          card={card.card}
          dataCard={card}
          deckId={deck.id}
        />
      ))}
    </div>
  );
}
