import type { ScryfallCard } from "#/features/scryfall/types";
import type { CollectionItem } from "#/features/collection/types";

import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

import EditCard from "./EditCard";

export interface UpdateCardData {
  scryfall_id?: string;
  quantity?: number;
  foil?: boolean;
  condition?: string;
  language?: string;
  folder?: number;
}

export function EditCardDialog({
  card,
  dataCard,
  open,
  onOpenChange,
  onUpdate,
}: {
  card: ScryfallCard | null;
  dataCard: CollectionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: UpdateCardData) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader></DialogHeader>

        <EditCard card={card} dataCard={dataCard} onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
