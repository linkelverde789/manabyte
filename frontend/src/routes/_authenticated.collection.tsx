import NewFolderDialog from "#/components/collection/newFolderDialog";
import NewDeckDialog from "#/components/decks/newDeckDialog";
import { Button } from "#/components/ui/button";
import { useDeleteFolder, useListFolders } from "#/features/folders/hooks";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Folder, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: folders } = useListFolders();
  const deleteFolder = useDeleteFolder();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            My collection
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {folders?.length} folders.
          </p>
        </div>
        <NewFolderDialog />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {folders?.map((folder) => {
          return (
            <div
              key={folder.id}
              className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
            >
              <Link
                to="/folders/$folderId"
                params={{ folderId: folder.id.toLocaleString() }}
                className="block space-y-2 pr-8"
              >
                <div className="flex items-center gap-2 text-xs tracking-wide text-muted-foreground">
                  <Folder />
                  {"Collection"}
                </div>
                <div className="text-lg font-semibold">{folder.name}</div>
                <div className="text-sm text-muted-foreground">{12} cards</div>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => deleteFolder.mutate(folder.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
