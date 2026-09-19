import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/labels";
import { Input } from "../ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useCreateFolder } from "#/features/folders/hooks";
import { FOLDER_FORMATS, type FolderFormat } from "#/features/folders/types";

export const DECK_FORMATS = [
  "Commander",
  "Modern",
  "Standard",
  "Pioneer",
  "Legacy",
  "Pauper",
  "Limited",
  "Casual",
] as const;

export type DeckFormat = (typeof DECK_FORMATS)[number];

export default function NewDeckDialog() {
  const navigate = useNavigate();
  const createFolder = useCreateFolder();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [format, setFormat] = useState<FolderFormat>("Collection");

  function handleCreate() {
    createFolder.mutate(
      {
        name: name || "Untitled Deck",
        type: format || "Collection",
      },
      {
        onSuccess: (folder) => {
          setOpen(false);
          setName("");
          navigate({
            to: "/folders/$folderId",
            params: { folderId: folder.id.toLocaleString() },
          });
        },
      },
    );
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> New folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a folder</DialogTitle>
          <DialogDescription>Choose a name and pick a type.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deck-name">Folder name</Label>
            <Input
              id="deck-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="There's the Door"
            />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select
              value={format}
              onValueChange={(value) => setFormat(value as FolderFormat)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOLDER_FORMATS.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleCreate}>
            Create folder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
