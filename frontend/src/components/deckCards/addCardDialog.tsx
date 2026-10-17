import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ManaCost from "../search/manaCost";
import { CardImage } from "./cardImage";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Layers, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "#/lib/utils";
import type { CreateCollectionItemData } from "#/features/collection/types";
import type { Card } from "#/lib/types";
import { useListPrints } from "#/features/utils/hooks";

export function AddCardDialog({
  card,
  open,
  onOpenChange,
  onCreate,
}: {
  card: Card | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: CreateCollectionItemData) => void;
}) {
  const [selected, setSelected] = useState<Card | null>(card);
  const [showStyles, setShowStyles] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelected(card);
    setShowStyles(false);
    setQuantity(1);
  }, [card]);

  const { data: printings, isLoading } = useListPrints(card?.oracle_id!);

  if (!card || !selected) return null;

  function submit() {
    if (!selected) return;
    let foil = selected.can_foil && !selected.can_nonfoil;

    onCreate({
      quantity: quantity,
      scryfall_id: selected?.external_id,
      foil,
      language: selected?.lang,
      condition: "NM",
    });
    setSelected(card);
    setShowStyles(false);
    setQuantity(1);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {selected.name} <ManaCost cost={selected.card_faces[0].mana_cost} />
          </DialogTitle>
          <DialogDescription>
            {selected.set.name} ({selected.set.code?.toUpperCase()}) #
            {selected.collector_number} · {selected.rarity}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          <CardImage
            card={selected.card_faces}
            alt={selected.name}
            layout={card.layout}
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-24 space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, Number(e.target.value) || 1))
                  }
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit} className="flex-1">
                Add card
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowStyles((s) => !s)}
              >
                <Layers className="mr-2 h-4 w-4" />
                {showStyles ? "Hide styles" : "Other styles"}
              </Button>
            </div>
          </div>
        </div>

        {showStyles && (
          <div className="space-y-3 border-t border-border pt-4">
            <p className="text-sm text-muted-foreground">
              Pick the printing you want — each style is stored separately.
            </p>
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading printings…
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {(printings ?? []).map((p) => {
                const isActive = p.external_id === selected.external_id;
                return (
                  <button
                    key={p.external_id}
                    type="button"
                    onClick={() => setSelected(p)}
                    className={cn(
                      "group space-y-1 rounded-xl p-1 text-left transition",
                      isActive ? "ring-2 ring-primary" : "hover:bg-muted/40",
                    )}
                  >
                    <CardImage
                      card={p.card_faces}
                      alt={p.name}
                      layout={card.layout}
                    />
                    <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {p.set.code?.toUpperCase()} #{p.collector_number}
                      </div>
                      <div className="line-clamp-2">{p.set.name}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
