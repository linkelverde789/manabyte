import type { CollectionItem } from "#/features/collection/types";
import type { UpdateCollectionCard } from "#/features/utils/types";
import type { Card } from "#/lib/types";

import { Dialog, DialogContent, DialogHeader } from "../../ui/dialog";

import EditCollectionCard from "../Base/EditCollectionCard";

export function EditDeckCardDialog({
  card,
  dataCard,
  open,
  onOpenChange,
  onUpdate,
}: {
  card: Card | null;
  dataCard: CollectionItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (data: UpdateCollectionCard) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader></DialogHeader>

        <EditCollectionCard
          card={card}
          dataCard={dataCard}
          onUpdate={onUpdate}
        />
      </DialogContent>
    </Dialog>
  );
}
