import CardSearch from "#/components/deckCards/cardSearch";
import type { CreateCollectionItemData } from "#/features/collection/types";
import type { ExportFormat } from "#/features/exports/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import {
  useBulkCreateCollectionItem,
  useCreateCollectionItem,
  useGetCollectionItems,
} from "#/features/collection/hooks";
import { useFolderExport } from "#/features/exports/hooks";
import { useGetFolder } from "#/features/folders/hooks";
import { useLoadCollection } from "#/features/scryfall/hooks";
import { downloadFile } from "#/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { FolderHeader } from "#/components/collection/FolderHeader";
import { FolderTabs } from "#/components/collection/FolderTabs";
import { FolderToolbar } from "#/components/collection/FolderToolbar";
import { FolderContent } from "#/components/collection/FolderContent";
import { toast } from "sonner";

export function SearchCards({
  onCreate,
}: {
  onCreate: (data: CreateCollectionItemData) => void;
}) {
  return <CardSearch onCreate={onCreate} />;
}

export const Route = createFileRoute("/_authenticated/folders/$folderId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { folderId: id } = Route.useParams();
  const folderId = parseInt(id);

  const { data: folder } = useGetFolder(folderId);

  const [exportType, setExportType] = useState<ExportFormat | null>(null);

  const { data: exportData } = useFolderExport({
    folderId,
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
    if (!exportData || !exportType) return;

    toast.dismiss();

    toast.success("Export complete!");

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

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <FolderHeader
        folderName={folder?.name}
        total={total}
        entries={collectionItems?.length ?? 0}
        onImport={async (rows) => {
          const data = rows.map((row) => ({
            scryfall_id: row.card.id,
            quantity: row.quantity,
            foil:
              row.card.foil === true &&
              (row.card.nonfoil !== true || row.foil === true),
            language: row.card.lang,
            condition: "MN",
          }));

          toast.loading("Importing list...")

          await bulkCreateCollectionItem({ items: data, folder_id: folderId });
        }}
      />

      <FolderTabs
        tab={tab}
        total={total}
        onTabChange={setTab}
        mainContent={
          <>
            <FolderToolbar
              term={term}
              onTermChange={setTerm}
              sort={sort}
              onSortChange={setSort}
              groupByType={groupByType}
              onGroupByTypeChange={setGroupByType}
              onExportFormatChange={setExportType}
            />

            <FolderContent
              isLoading={isLoading}
              deckRows={deckRows}
              groupByType={groupByType}
            />
          </>
        }
        searchContent={<SearchCards onCreate={handleCreate} />}
      />
    </div>
  );
}
