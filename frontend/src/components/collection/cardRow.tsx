import type { ScryfallCard } from "#/features/scryfall/types";
import type { CollectionItem } from "#/features/collection/types";

import { Minus, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

import { CardImage } from "../deckCards/cardImage";
import { Button } from "../ui/button";

import {
  useDeleteCollectionItem,
  usePartialUpdateCollectionItem,
} from "#/features/collection/hooks";

import { type UpdateCardData } from "../dialogs/EditCardDialog";
import ShowPrice from "./showPrice";

import ManaCost from "../search/manaCost";
import GeneralDialog from "../dialogs/GeneralDialog";

export default function CardRow({
  dataCard,
  card,
}: {
  dataCard: CollectionItem;
  card: ScryfallCard;
}) {
  const partialUpdateCollectorItem = usePartialUpdateCollectionItem();

  const deleteCollectorItem = useDeleteCollectionItem();

  const [openDialog, setOpenDialog] = useState(false);
  const [initialTab, setInitialTab] = useState<"preview" | "edit">("preview");

  function handleQuantity(quantity: number) {
    if (quantity < 1) {
      deleteCollectorItem.mutate(dataCard.id);
    } else {
      partialUpdateCollectorItem.mutate({
        cardId: dataCard.id,
        data: { quantity },
      });
    }
  }

  function handleUpdate(data: UpdateCardData) {
    partialUpdateCollectorItem.mutate({
      cardId: dataCard.id,
      data: {
        ...data,
      },
    });

    setOpenDialog(false);
  }

  return (
    <>
      <div
        className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"

        onClick={() => {
          setInitialTab("preview");
          setOpenDialog(true);
        }}
      >
        <div className="w-20 shrink-0">
          <CardImage card={card} alt={card.name} foil={dataCard.foil} />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <div className="line-clamp-2 text-sm font-medium">{card.name}</div>

            <ManaCost cost={card.mana_cost} />
          </div>

          <div className="text-xs text-muted-foreground">
            {card.set_name!.length > 20
              ? `${card.set_name!.slice(0, 20)}...`
              : card.set_name}{" "}
            ({card.set!.toUpperCase()}) #{card.collector_number}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5">
              {dataCard.condition}
            </span>

            {dataCard.foil && (
              <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-primary">
                <Sparkles className="h-3 w-3" />
                Foil
              </span>
            )}

            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs text-muted-foreground"
              onClick={(e) => {
                e.stopPropagation();

                setInitialTab("edit");
                setOpenDialog(true);
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

                handleQuantity(dataCard.quantity - 1);
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
                handleQuantity(dataCard.quantity + 1);
              }}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>

            {dataCard.foil ? (
              <ShowPrice price={card.prices?.usd_foil} />
            ) : (
              <ShowPrice price={card.prices?.usd} />
            )}

            <Button
              size="icon"
              variant="ghost"
              className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                deleteCollectorItem.mutate(dataCard.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      <GeneralDialog
        card={card}
        dataCard={dataCard}
        open={openDialog}
        onOpenChange={setOpenDialog}
        initialTab={initialTab}
        onUpdate={handleUpdate}
      />
    </>
  );
}
