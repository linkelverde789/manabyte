import { CollectionHeader } from "#/components/collection/CollectionHeader";
import { FolderRow } from "#/components/collection/FolderRow";
import NewFolderDialog from "#/components/collection/newFolderDialog";
import { FolderRowSkeleton } from "#/components/collection/skeletons";
import { useDeleteFolder, useListFolders } from "#/features/folders/hooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: folders, isLoading } = useListFolders();
  const deleteFolder = useDeleteFolder();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <CollectionHeader
          folderCount={folders?.length ?? 0}
          isLoading={isLoading}
        />
        <NewFolderDialog />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, key) => (
              <FolderRowSkeleton key={key} />
            ))
          : folders?.map((folder) => {
              return (
                <FolderRow
                  folder={folder}
                  onDelete={() => deleteFolder.mutate(folder.id)}
                />
              );
            })}
      </div>
    </div>
  );
}
