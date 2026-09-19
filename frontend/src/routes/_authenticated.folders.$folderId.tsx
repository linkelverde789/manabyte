import CardRow from "#/components/collection/cardRow";
import CardSearch from "#/components/deckCards/cardSearch";
import EmptyDeck from "#/components/deckCards/emptyDeck";
import { ImportDialog } from "#/components/deckCards/importDialog";
import { CardRowSkeleton } from "#/components/deckCards/skeletons";
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
import { useGetFolder } from "#/features/folders/hooks";
import { useLoadCollection } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId } = Route.useParams();
  const { data: folder } = useGetFolder(folderId);
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

  function handleCreate(scryfall_id: string, quantity: number) {
    createCollectionItem.mutate({
      scryfall_id,
      quantity,
      foil: false,
      language: "en",
      condition: "MN",
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
          card.set_name.toLowerCase().includes(query);

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
        const priceA = Number(a.card.prices?.usd ?? 0);
        const priceB = Number(b.card.prices?.usd ?? 0);

        return priceB - priceA;
      }

      return 0;
    });
  }, [collectionItems, collection, debounced, sort]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {/*My collection - {folder?.name}*/}
            {folder?.name}
          </h1>

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
                foil: false,
                language: "en",
                condition: "MN",
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
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <CardRowSkeleton key={index} />
              ))}
            </div>
          ) : deckRows.length === 0 ? (
            <EmptyDeck />
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

const MemoizedCardRow = memo(CardRow);
