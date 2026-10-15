import CardSearch from "#/components/deckCards/cardSearch";
import type { CreateCollectionItemData } from "#/features/collection/types";
import type { ExportFormat } from "#/features/exports/types";
import {
  useBulkCreateCollectionItem,
  useCreateCollectionItem,
  useGetCollectionItems,
} from "#/features/collection/hooks";
import { useFolderExport } from "#/features/exports/hooks";
import { useGetFolder } from "#/features/folders/hooks";
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

  const { mutateAsync: bulkCreateCollectionItem } =
    useBulkCreateCollectionItem();

  const createCollectionItem = useCreateCollectionItem();

  const [sorting, setSort] = useState<"recent" | "price" | "name" | "quantity">(
    "recent",
  );
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const { data: collectionItems, isLoading } = useGetCollectionItems({
    folderId,
    sorting,
    q: debounced,
  });
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

  const total =
    collectionItems?.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <FolderHeader
        folderId={folderId}
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

          toast.loading("Importing list...");

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
              sort={sorting}
              onSortChange={setSort}
              groupByType={groupByType}
              onGroupByTypeChange={setGroupByType}
              onExportFormatChange={setExportType}
            />

            <FolderContent
              isLoading={isLoading}
              isResolvingCards={isLoading}
              deckRows={collectionItems ?? []}
              groupByType={groupByType}
            />
          </>
        }
        searchContent={<SearchCards onCreate={handleCreate} />}
      />
    </div>
  );
}
