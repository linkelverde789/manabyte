import EmptyDeck from "#/components/deckCards/emptyDeck";
import { CardRowSkeleton } from "#/components/deckCards/skeletons";
import { Checkbox } from "#/components/ui/CheckBox";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Export } from "#/components/utils/Export";
import { useGetCollectionItems } from "#/features/collection/hooks";
import { useFolderExport } from "#/features/exports/hooks";
import type { ExportFormat } from "#/features/exports/types";
import type { Folder } from "#/features/folders/types";
import { useLoadCollection } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { downloadFile, groupCardsByType } from "#/lib/utils";
import { memo, useEffect, useMemo, useState } from "react";
import CardRow from "./cardRow";
import type { CollectionItem } from "#/features/collection/types";

export default function FolderBody({ folder }: { folder: Folder }) {
  const [sort, setSort] = useState<string>("recent");
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [groupByType, setGroupByType] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const { data: exportData } = useFolderExport({
    folderId: folder.id,
    format: exportFormat,
  });

  useEffect(() => {
    if (!exportData || !exportFormat) return;

    downloadFile(
      exportData.blob,
      exportData.filename
        ? exportData.filename
        : `${folder?.name}.${exportFormat}`,
    );
  }, [exportData, exportFormat]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(term.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <div className="flex flex-wrap gap-3">
      <SearchingOption term={term} onSearch={() => setTerm} />
      <SortingOption sort={sort} onSort={() => setSort} />
      <GroupingOption checked={groupByType} onCheck={() => setGroupByType} />
      <Export onExportFormatChange={(format) => setExportFormat(format)} />
      <FolderContent
        folderId={folder.id}
        term={debounced}
        sorting={sort}
        groupByType={groupByType}
      />
    </div>
  );
}

export function SortingOption({
  sort,
  onSort,
}: {
  sort: string;
  onSort: (sort: string) => {};
}) {
  return (
    <Select
      defaultValue="recent"
      value={sort}
      onValueChange={(value) => onSort(value)}
    >
      <SelectTrigger className="w-44">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="recent">Recently added</SelectItem>
        <SelectItem value="name">Name</SelectItem>
        <SelectItem value="quantity">Quantity</SelectItem>
        <SelectItem value="price">Price</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function SearchingOption({
  term,
  onSearch,
}: {
  term: string;
  onSearch: (text: string) => void;
}) {
  return (
    <Input
      value={term}
      onChange={(value) => onSearch(value.target.value)}
      placeholder="Filter by name or set"
      className="max-w-xs"
    />
  );
}

export function GroupingOption({
  checked,
  onCheck,
}: {
  checked: boolean;
  onCheck: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="group-by-type"
        className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
      >
        <Checkbox
          id="group-by-type"
          checked={checked}
          onCheckedChange={(checked) => onCheck(!!checked)}
        />
        Group by type
      </label>
    </div>
  );
}

export function FolderContent({
  term,
  groupByType,
  sorting,
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

  const {
    mutate: loadCollection,
    data: results,
    reset: resetCollection,
  } = useLoadCollection();

  const missingIds = useMemo(() => {
    return (
      collectionItems
        ?.map((card) => card.scryfall_id)
        .filter((id) => !collection[id])
        .map((id) => ({ id })) ?? []
    );
  }, [collectionItems, collection]);

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
    const query = term!.toLowerCase();

    const rows =
      collectionItems?.flatMap((dataCard) => {
        const card = collection[dataCard.scryfall_id];

        if (!card) {
          return [];
        }

        const matches =
          card.name.toLowerCase().includes(query) ||
          card.set_name?.toLowerCase().includes(query);

        if (!matches) {
          return [];
        }

        return [
          {
            card,
            dataCard,
          },
        ];
      }) ?? [];
    return rows.sort((a, b) => {
      if (sorting === "name") {
        return a.card.name.localeCompare(b.card.name);
      }

      if (sorting === "quantity") {
        return b.dataCard.quantity - a.dataCard.quantity;
      }

      if (sorting === "price") {
        const priceA = Number(
          (a.dataCard.foil ? a.card.prices?.usd_foil : a.card.prices?.usd) ?? 0,
        );
        const priceB = Number(
          (b.dataCard.foil ? b.card.prices?.usd_foil : b.card.prices?.usd) ?? 0,
        );

        return priceB - priceA;
      }

      return 0;
    });
  }, [collectionItems, collection, term, sorting]);

  return isLoading ? (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <CardRowSkeleton key={index} />
      ))}
    </div>
  ) : deckRows.length === 0 ? (
    <EmptyDeck />
  ) : groupByType ? (
    <RenderGroupedCards data={deckRows} />
  ) : (
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
