import ManaCost from "#/components/search/manaCost";
import { Button } from "#/components/ui/button";
import {
  useDeleteDeckCard,
  usePartialUpdateDeckCard,
} from "#/features/deckCards/hooks";
import { Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CardImage } from "./cardImage";
import type { DeckCard } from "#/features/deckCards/types";
import type { UpdateDeckCard } from "../dialogs/Base/EditCollectionCard";
import type { Card } from "#/lib/types";
import GeneralDeckDialog from "../dialogs/GeneralDialog/GeneralDeckDialog";

export default function CardRow({
  card,
  dataCard,
  deckId,
}: {
  card: Card;
  dataCard: DeckCard;
  deckId: number;
}) {
  const [open, setOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<"preview" | "edit">("preview");
  const deleteCard = useDeleteDeckCard(deckId);
  const updateCard = usePartialUpdateDeckCard(deckId);

  const isUpdating = deleteCard.isPending || updateCard.isPending;

  function handleUpdate(data: UpdateDeckCard) {
    if (isUpdating) {
      return;
    }

    if (data.quantity && data.quantity < 1) {
      deleteCard.mutate(dataCard.id);
      return;
    }
    updateCard.mutate({
      cardId: dataCard.id,
      data: { ...data },
    });

    setOpen(false);
  }

  function handleDelete() {
    if (isUpdating) {
      return;
    }

    deleteCard.mutate(dataCard.id);
  }

  return (
    <>
      <div
        className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"

        onClick={() => {
          setInitialTab("preview");
          setOpen(true);
        }}
      >
        <div className="w-20 shrink-0">
          <CardImage
            card={card.card_faces}
            alt={card.name}
            layout={card.layout}
          />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="line-clamp-2 text-sm font-medium">{card.name}</div>

            <ManaCost cost={card.card_faces[0].mana_cost} />
          </div>

          <div className="text-xs text-muted-foreground">
            {card.set.name!.length > 20
              ? `${card.set.name!.slice(0, 20)}...`
              : card.set.name}{" "}
            ({card.set.code!.toUpperCase()}) #{card.collector_number}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();

                setInitialTab("edit");
                setOpen(true);
              }}
            >
              <Pencil className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-1 pt-1">
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();

                handleUpdate({ quantity: dataCard.quantity - 1 });
              }}
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>

            <span className="w-8 text-center text-sm font-medium">
              {dataCard.quantity}
            </span>

            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate({ quantity: dataCard.quantity + 1 });
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <GeneralDeckDialog
        card={card}
        dataCard={dataCard}
        open={open}
        onOpenChange={setOpen}
        initialTab={initialTab}
        onUpdate={handleUpdate}
      />
    </>
  );
}
