import type { CollectionItem } from "#/features/collection/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import { groupCardsByType } from "#/lib/utils";
import { memo } from "react";
import EmptyDeck from "../deckCards/emptyDeck";
import { CardRowSkeleton } from "../deckCards/skeletons";
import CardRow from "./cardRow";

export function FolderContent({
  isLoading,
  deckRows,
  groupByType,
}: {
  isLoading: boolean;
  deckRows: DeckRow[];
  groupByType: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <CardRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (deckRows.length === 0) {
    return <EmptyDeck />;
  }

  if (groupByType) {
    return <GroupedCards data={deckRows} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deckRows.map(({ card, dataCard }) => (
        <MemoizedCardRow key={dataCard.id} card={card} dataCard={dataCard} />
      ))}
    </div>
  );
}

type DeckRow = {
  card: ScryfallCard;
  dataCard: CollectionItem;
};

function GroupedCards({ data }: { data: DeckRow[] }) {
  const grouped = groupCardsByType(data);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, rows]) => (
        <div key={type}>
          <h2 className="mb-2 text-lg font-semibold">{type}</h2>

          <div className="space-y-2">
            {rows.map(({ card, dataCard }) => (
              <MemoizedCardRow
                key={dataCard.id}
                card={card}
                dataCard={dataCard}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const MemoizedCardRow = memo(CardRow);
