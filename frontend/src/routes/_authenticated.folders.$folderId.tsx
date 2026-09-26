import CardRow from "#/components/collection/cardRow";
import CardSearch from "#/components/deckCards/cardSearch";
import EmptyDeck from "#/components/deckCards/emptyDeck";
import { ImportDialog } from "#/components/deckCards/importDialog";
import { CardRowSkeleton } from "#/components/deckCards/skeletons";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/CheckBox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import {
  useBulkCreateCollectionItem,
  useCreateCollectionItem,
  useGetCollectionItems,
} from "#/features/collection/hooks";
import type {
  CollectionItem,
  CreateCollectionItemData,
} from "#/features/collection/types";
import { useFolderExport } from "#/features/exports/hooks";
import type { ExportFormat } from "#/features/exports/types";
import { useGetFolder } from "#/features/folders/hooks";
import { useLoadCollection } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { downloadFile, groupCardsByType } from "#/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, Download } from "lucide-react";
import { memo, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();
  const { data: folder } = useGetFolder(folderId);
  const [exportType, setExportType] = useState<ExportFormat | null>(null);
  const { data: exportData } = useFolderExport({
    folderId: folderId,
    format: exportType,
  });
  const [groupByType, setGroupByType] = useState(false);
  const { data: collectionItems, isLoading } = useGetCollectionItems({
    folderId,
  });
  const { mutateAsync: bulkCreateCollectionItem } =
    useBulkCreateCollectionItem();
  const createCollectionItem = useCreateCollectionItem();

  const [collection, setCollection] = useState<Record<string, ScryfallCard>>(
    {},
  );
  const {
    mutate: loadCollection,
    data: results,
    reset: resetCollection,
  } = useLoadCollection();
  const [sort, setSort] = useState<string>("recent");
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tab, setTab] = useState<"main" | "search">("main");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounced(term.trim());
    }, 350);

    return () => clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    console.log(exportData);
    console.log(exportType);

    if (!exportData || !exportType) return;

    console.log("pasa por aqui");

    downloadFile(
      exportData.blob,
      exportData.filename
        ? exportData.filename
        : `${folder?.name}.${exportType}`,
    );
  }, [exportData, exportType]);

  function handleCreate(data: CreateCollectionItemData) {
    createCollectionItem.mutate({
      scryfall_id: data.scryfall_id,
      quantity: data.quantity,
      foil: data.foil,
      language: data.language,
      condition: "MN",
      folder_id: folderId,
    });
  }

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

  const total =
    collectionItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  const deckRows = useMemo(() => {
    const query = debounced.toLowerCase();

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
      if (sort === "name") {
        return a.card.name.localeCompare(b.card.name);
      }

      if (sort === "quantity") {
        return b.dataCard.quantity - a.dataCard.quantity;
      }

      if (sort === "price") {
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
  }, [collectionItems, collection, debounced, sort]);

  /* 
  const totalPrice = useMemo(() => {
    return (
      collectionItems?.reduce((total, dataCard) => {
        const card = collection[dataCard.scryfall_id];

        if (!card) {
          return total;
        }

        const price = Number(card.prices?.usd ?? 0);

        return total + price * dataCard.quantity;
      }, 0) ?? 0
    );
  }, [collectionItems, collection]);
  */

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {/*My collection - {folder?.name}*/}
            {folder?.name}
          </h1>

          {/* TODO: Refactor this
          <h2>${totalPrice.toFixed(2)}</h2>
          */}

          <p className="mt-1 text-sm text-muted-foreground">
            {total} cards · {collectionItems?.length ?? 0} entries
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <ImportDialog
            title={`Paste a list into collection`}
            description="Import cards from a decklist. One card per line."
            confirmLabel="Add to collection"
            onConfirm={async (rows) => {
              const data = rows.map((row) => ({
                scryfall_id: row.card.id,
                quantity: row.quantity,
                foil: row.card.foil === true && row.card.nonfoil !== true,
                language: row.card.lang,
                condition: "MN",
                folder_id: folderId,
              }));

              await bulkCreateCollectionItem(data);
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
          <TabsTrigger value="main">Folder ({total})</TabsTrigger>

          <TabsTrigger value="search">Search cards</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            <Input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Filter by name or set"
              className="max-w-xs"
            />

            <Select
              defaultValue="recent"
              value={sort}
              onValueChange={(value) => setSort(value)}
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

            <div className="flex items-center space-x-2">
              <label
                htmlFor="group-by-type"
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm"
              >
                <Checkbox
                  id="group-by-type"
                  checked={groupByType}
                  onCheckedChange={(checked) => setGroupByType(!!checked)}
                />
                Group by type
              </label>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="h-4 w-4" /> Export{" "}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => setExportType("csv")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setExportType("xlsx")}>
                  Export as XLSX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isLoading ? (
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
                <MemoizedCardRow
                  key={dataCard.id}
                  card={card}
                  dataCard={dataCard}
                />
              ))}
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
