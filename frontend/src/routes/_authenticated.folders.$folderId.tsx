import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import FolderBody from "#/components/collection/FolderContent";
import CardSearch from "#/components/deckCards/cardSearch";
import { ImportDialog } from "#/components/deckCards/importDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

import {
  useBulkCreateCollectionItem,
  useCreateCollectionItem,
  useGetCollectionItems,
} from "#/features/collection/hooks";
import { useGetFolder } from "#/features/folders/hooks";

import type { CreateCollectionItemData } from "#/features/collection/types";

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId: id } = Route.useParams();
  const folderId = parseInt(id);
  const { data: folder } = useGetFolder(folderId);

  const { data: collectionItems, isLoading } = useGetCollectionItems({
    folderId,
  });
  const { mutateAsync: bulkCreateCollectionItem } =
    useBulkCreateCollectionItem();
  const createCollectionItem = useCreateCollectionItem();

  const [tab, setTab] = useState<"main" | "search">("main");

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

  const total =
    collectionItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  if (!folder) {
    return <p>espera</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
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

      <Tabs value={tab} onValueChange={(value) => setTab(value as any)}>
        <TabsList>
          <TabsTrigger value="main">Collection</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <FolderBody folder={folder} />
        </TabsContent>

        <TabsContent value="search">
          <CardSearch onCreate={handleCreate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
