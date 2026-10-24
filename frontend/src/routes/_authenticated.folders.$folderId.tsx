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
import { useEffect, useState } from "react";
import { FolderHeader } from "#/components/collection/FolderHeader";
import { FolderTabs } from "#/components/collection/FolderTabs";
import { FolderToolbar } from "#/components/collection/FolderToolbar";
import { FolderContent } from "#/components/collection/FolderContent";
import { toast } from "sonner";
import type { SortingOptions } from "#/lib/types";

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
  const [page, setPage] = useState(1);
  const [sorting, setSort] = useState<SortingOptions>("recent");
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [tab, setTab] = useState<"main" | "search">("main");

  const { data: exportData } = useFolderExport({
    folderId,
    format: exportType,
  });

  const createCollectionItem = useCreateCollectionItem();

  const { mutateAsync: bulkCreateCollectionItem } =
    useBulkCreateCollectionItem();

  const { data: collectionItems, isLoading } = useGetCollectionItems({
    folderId,
    sorting,
    q: debounced,
    limit: 60,
    page,
  });

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
      condition: "NM",
      folder_id: folderId,
    });
  }

  const total =
    collectionItems?.data.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <FolderHeader
        folderId={folderId}
        onImport={async (rows) => {
          const data = rows.map((row) => ({
            scryfall_id: row.scryfall_id,
            quantity: row.quantity,
            foil: row.foil ?? false,
            language: "en",
            condition: "NM",
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
              onExportFormatChange={setExportType}
            />

            <FolderContent
              page={page}
              onChangePage={setPage}
              totalPages={collectionItems?.pages ?? 1}
              isLoading={isLoading}
              isResolvingCards={isLoading}
              deckRows={collectionItems?.data ?? []}
            />
          </>
        }
        searchContent={<SearchCards onCreate={handleCreate} />}
      />
    </div>
  );
}
