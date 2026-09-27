import { useGetCollectionItems } from "#/features/collection/hooks";
import { useLoadCollection } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { CardRowSkeleton } from "../deckCards/skeletons";
import EmptyDeck from "../deckCards/emptyDeck";
import { groupCardsByType } from "#/lib/utils";
import type { CollectionItem } from "#/features/collection/types";
import CardRow from "./cardRow";

export function FolderContent({
  term = "",
  groupByType = false,
  sorting = "recent",
  folderId,
}: {
  term?: string;
  groupByType?: boolean;
  sorting?: string;
  folderId: number;
}) {
  const { data: collectionItems, isLoading } = useGetCollectionItems({
    folderId,
  });

  const [collection, setCollection] = useState<Record<string, ScryfallCard>>(
    {},
  );

  const loadedIds = useRef(new Set<string>());
  const loadingIds = useRef(new Set<string>());

  const { mutate: loadCollection, data: results } = useLoadCollection();

  const missingIds = useMemo(() => {
    if (!collectionItems) {
      return [];
    }

    const uniqueIds = new Set(collectionItems.map((item) => item.scryfall_id));

    return Array.from(uniqueIds)
      .filter((id) => {
        return (
          !loadedIds.current.has(id) &&
          !loadingIds.current.has(id) &&
          !collection[id]
        );
      })
      .map((id) => ({ id }));
  }, [collectionItems, collection]);

  useEffect(() => {
    if (missingIds.length === 0) {
      return;
    }

    const ids = missingIds.map(({ id }) => id);

    ids.forEach((id) => {
      loadingIds.current.add(id);
    });

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

        loadedIds.current.add(card.id);
        loadingIds.current.delete(card.id);
      }

      return next;
    });
  }, [results]);

  const deckRows = useMemo(() => {
    const query = term.trim().toLowerCase();

    const rows =
      collectionItems?.flatMap((dataCard) => {
        const card = collection[dataCard.scryfall_id];

        if (!card) {
          return [];
        }

        if (query) {
          const matches =
            card.name.toLowerCase().includes(query) ||
            card.set_name?.toLowerCase().includes(query);

          if (!matches) {
            return [];
          }
        }

        return [{ card, dataCard }];
      }) ?? [];

    return [...rows].sort((a, b) => {
      switch (sorting) {
        case "name":
          return a.card.name.localeCompare(b.card.name);

        case "quantity":
          return b.dataCard.quantity - a.dataCard.quantity;

        case "price": {
          const priceA = Number(
            (a.dataCard.foil ? a.card.prices?.usd_foil : a.card.prices?.usd) ??
              0,
          );

          const priceB = Number(
            (b.dataCard.foil ? b.card.prices?.usd_foil : b.card.prices?.usd) ??
              0,
          );

          return priceB - priceA;
        }

        case "recent":
        default:
          return 0;
      }
    });
  }, [collectionItems, collection, term, sorting]);

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
    return <RenderGroupedCards data={deckRows} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {deckRows.map(({ card, dataCard }) => (
        <MemoizedCardRow key={dataCard.id} card={card} dataCard={dataCard} />
      ))}
    </div>
  );
}

function RenderGroupedCards({
  data,
}: {
  data: { card: ScryfallCard; dataCard: CollectionItem }[];
}) {
  const grouped = groupCardsByType(data);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, rows]) => (
        <div key={type}>
          <h2 className="text-lg font-semibold mb-2">{type}</h2>
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
