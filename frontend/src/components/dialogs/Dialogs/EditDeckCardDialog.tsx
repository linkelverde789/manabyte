import type { DeckCard } from "#/features/deckCards/types";
import type { UpdateDeckCard } from "#/features/utils/types";
import type { Card } from "#/lib/types";

import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";

import EditDeckCard from "../Base/EditDeckCard";

export function EditDeckCardDialog({
  card,
  dataCard,
  open,
  onOpenChange,
  onUpdate,
}: {
  card: Card | null;
  dataCard: DeckCard | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: UpdateDeckCard) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader></DialogHeader>

        <EditDeckCard card={card} dataCard={dataCard} onUpdate={onUpdate} />
      </DialogContent>
    </Dialog>
  );
}
