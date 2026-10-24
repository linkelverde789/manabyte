import { Dialog, DialogContent } from "#/components/ui/dialog";
import type { Card } from "#/lib/types";
import { CardPicker } from "../Base/CardPicker";

export function CardPickerDialog({
  open,
  onOpenChange,
  cards,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: Card[];
  onSelect: (card: Card) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto p-4 sm:max-w-5xl">
        <CardPicker
          cards={cards}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
