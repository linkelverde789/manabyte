import type { CollectionItem } from "#/features/collection/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import { groupCardsByType } from "#/lib/utils";
import { memo } from "react";
import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "./cardRow";

export function FolderContent({
  isLoading,
  isResolvingCards,
  deckRows,
  groupByType,
}: {
  isLoading: boolean;
  isResolvingCards: boolean;
  deckRows: DeckRow[];
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

export function ItemRowSkeleton() {
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
