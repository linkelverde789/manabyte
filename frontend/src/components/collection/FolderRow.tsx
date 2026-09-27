import type { Folder } from "#/features/folders/types";
import { Link } from "@tanstack/react-router";
import { Folder as FolderIcon, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export function FolderRow({
  folder,
  onDelete,
}: {
  folder: Folder;
  onDelete: (folderId: number) => void;
}) {
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
          <FolderIcon />
          Collection
        </div>
        <div className="text-lg font-semibold">{folder.name}</div>
        <div className="text-sm text-muted-foreground">
          {folder.card_count} cards
        </div>
      </Link>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(folder.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
