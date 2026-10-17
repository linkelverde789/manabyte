import CardSearch from "#/components/deckCards/cardSearch";
import type { CreateCollectionItemData } from "#/features/collection/types";
import type { ExportFormat } from "#/features/exports/types";
import {
  useBulkCreateCollectionItem,
  useCreateCollectionItem,
  useGetCollectionItems,
} from "#/features/collection/hooks";
import { useCollectionExport } from "#/features/exports/hooks";
import { downloadFile } from "#/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderTabs } from "#/components/collection/FolderTabs";
import { FolderToolbar } from "#/components/collection/FolderToolbar";
import { FolderContent } from "#/components/collection/FolderContent";
import { toast } from "sonner";
import { CompleteCollectionHeader } from "#/components/collection/CompleteCollectionHeader";
export const Route = createFileRoute("/_authenticated/collection/cards")({
  component: RouteComponent,
});

export function SearchCards({
  onCreate,
}: {
  onCreate: (data: CreateCollectionItemData) => void;
}) {
  return <CardSearch onCreate={onCreate} />;
}

function RouteComponent() {
  const [exportType, setExportType] = useState<ExportFormat | null>(null);

  const { mutateAsync: bulkCreateCollectionItem } =
    useBulkCreateCollectionItem();

  const createCollectionItem = useCreateCollectionItem();

  const [sorting, setSort] = useState<"recent" | "price" | "name" | "quantity">(
    "recent",
  );
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");

  const [page, setPage] = useState(1);

  const [tab, setTab] = useState<"main" | "search">("main");
  const { data: cards, isLoading } = useGetCollectionItems({
    q: debounced,
    sorting,
    page: page,
    limit: 60,
  });

  function handleSorting(sorting: "recent" | "price" | "name" | "quantity") {
    setSort(sorting);
    setPage(1);
  }

  const { data: exportData } = useCollectionExport({
    format: exportType,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setDebounced(term.trim());
    }, 500);

    return () => clearTimeout(timeout);
  }, [term]);

  useEffect(() => {
    if (!exportData || !exportType) return;

    toast.dismiss();

    toast.success("Export complete!");

    downloadFile(
      exportData.blob,
      exportData.filename ? exportData.filename : `collection.${exportType}`,
    );
  }, [exportData, exportType]);

  function handleCreate(data: CreateCollectionItemData) {
    createCollectionItem.mutate({
      scryfall_id: data.scryfall_id,
      quantity: data.quantity,
      foil: data.foil,
      language: data.language,
      condition: "NM",
    });
    setPage(1);
  }

  const total = cards?.data.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <CompleteCollectionHeader
        onImport={async (rows) => {
          const data = rows.map((row) => ({
            scryfall_id: row.card.id,
            quantity: row.quantity,
            foil:
              row.card.foil === true &&
              (row.card.nonfoil !== true || row.foil === true),
            language: row.card.lang,
            condition: "NM",
          }));

          toast.loading("Importing list...");

          await bulkCreateCollectionItem({ items: data });
          setPage(1);
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
              sort={sorting}
              onSortChange={handleSorting}
              onExportFormatChange={setExportType}
            />

            <FolderContent
              isLoading={isLoading}
              isResolvingCards={isLoading}
              deckRows={cards?.data ?? []}
              page={page}
              onChangePage={setPage}
              totalPages={cards?.pages ?? 1}
            />
          </>
        }
        searchContent={<SearchCards onCreate={handleCreate} />}
      />
    </div>
  );
}
