import EmptyDeck from "../deckCards/emptyDeck";
import CardRow from "./cardRow";
import { ItemRowSkeleton } from "./skeletons";
import type { CollectionItem } from "#/features/collection/types";
import { PaginatorSkeleton } from "../utils/paginators/skeletons";
import { Paginator } from "../utils/paginators/Paginator";
import { useDeleteCollectionItem } from "#/features/collection/hooks";

export function FolderContent({
  isLoading,
  isResolvingCards,
  deckRows,
  page,
  totalPages,
  onChangePage,
}: {
  isLoading: boolean;
  isResolvingCards: boolean;
  deckRows: CollectionItem[];
  page: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) {
  const deleteCollectorItem = useDeleteCollectionItem();

  function handleDeleteItem(dataCardId: number) {
    deleteCollectorItem.mutate(dataCardId);

    if (deckRows.length == 1) {
      onChangePage(page - 1);
    }
  }

  if (isLoading || isResolvingCards) {
    return (
      <div>
        <div
          className="mx-auto max-w-6xl space-y-6 px-4 py-10"
          aria-busy="true"
          aria-label="Loading set album"
        >
          <PaginatorSkeleton />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 15 }).map((_, index) => (
            <ItemRowSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (!isResolvingCards && deckRows.length === 0) {
    return (
      <div
        className="mx-auto max-w-6xl space-y-6 px-4 py-10"
        aria-busy="true"
        aria-label="Loading set album"
      >
        <EmptyDeck />
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <Paginator
          page={page}
          totalPages={totalPages}
          onChangePage={onChangePage}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {deckRows.map((item) => (
          <CardRow
            key={item.id}
            card={item.card}
            dataCard={item}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <Paginator
          page={page}
          totalPages={totalPages}
          onChangePage={onChangePage}
        />
      </div>
    </div>
  );
}
