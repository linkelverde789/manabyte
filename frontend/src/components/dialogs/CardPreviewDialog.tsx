import type { Card } from "#/lib/types";
import { Dialog, DialogContent } from "../ui/dialog";
import { CardPreview } from "./CardPreview";

export function CardPreviewDialog({
  open,
  onOpenChange,
  card,
}: {
  card: Card;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-y-auto p-0 sm:max-w-4xl">
        <CardPreview card={card} />
      </DialogContent>
    </Dialog>
  );
}
