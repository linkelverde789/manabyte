import { groupCardsByType } from "#/lib/utils";
import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "./cardRow";
import { ItemRowSkeleton } from "./skeletons";
import type { CollectionItem } from "#/features/collection/types";

export function FolderContent({
  isLoading,
  isResolvingCards,
  deckRows,
  groupByType,
}: {
  isLoading: boolean;
  isResolvingCards: boolean;
  deckRows: CollectionItem[];
  groupByType: boolean;
}) {
  if (isLoading || isResolvingCards) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 15 }).map((_, index) => (
          <ItemRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!isResolvingCards && deckRows.length === 0) {
    return <EmptyDeck />;
  }

  if (groupByType) {
    return <GroupedCards data={deckRows} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deckRows.map((item) => (
        <CardRow key={item.id} card={item.card} dataCard={item} />
      ))}
    </div>
  );
}

function GroupedCards({ data }: { data: CollectionItem[] }) {
  const deckRows = data.map((item) => {
    return { dataCard: item, card: item.card };
  });
  const grouped = groupCardsByType(deckRows);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, rows]) => (
        <div key={type}>
          <h2 className="mb-2 text-lg font-semibold">{type}</h2>

          <div className="space-y-2">
            {rows.map(({ card, dataCard }) => (
              <CardRow key={dataCard.id} card={card} dataCard={dataCard} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
