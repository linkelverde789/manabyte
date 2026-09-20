import { useEffect, useState } from "react";

import { useSearchCardStyles } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import type { CollectionItem } from "#/features/collection/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";

import ManaCost from "../search/manaCost";
import { CardImage } from "./cardImage";
import { cardImage, styleLabel } from "./stylePicker";

import { Layers, Loader2, Sparkles } from "lucide-react";

import { cn } from "#/lib/utils";
import { Label } from "../ui/labels";

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
  const [selected, setSelected] = useState<ScryfallCard | null>(card);

  const [showStyles, setShowStyles] = useState(false);

  const [quantity, setQuantity] = useState(dataCard?.quantity ?? 1);

  const [foil, setFoil] = useState(dataCard?.foil ?? false);

  const [condition, setCondition] = useState(dataCard?.condition ?? "NM");

  useEffect(() => {
    setSelected(card);
    setShowStyles(false);

    setQuantity(dataCard?.quantity ?? 1);
    setFoil(dataCard?.foil ?? false);
    setCondition(dataCard?.condition ?? "NM");
  }, [card, dataCard]);

  const { data: printings, isLoading } = useSearchCardStyles(
    showStyles && selected ? selected.name : "",
  );

  if (!card || !selected || !dataCard) {
    return null;
  }

  function submit() {
    onUpdate({
      scryfall_id: selected?.id,
      quantity: Math.max(1, quantity),
      foil,
      condition,
    });

    onOpenChange(false);
  }

  const canFoil = (selected.finishes ?? []).some(
    (finish) => finish !== "nonfoil",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            {selected.name}

            <ManaCost cost={selected.mana_cost} />
          </DialogTitle>

          <DialogDescription>
            {selected.set_name} ({selected.set!.toUpperCase()}) #
            {selected.collector_number} · {selected.rarity}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          <div className="mx-auto w-full max-w-[200px]">
            <CardImage src={cardImage(selected)} alt={selected.name} />
          </div>

          <div className="space-y-5">
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

              <div className="w-28 space-y-2">
                <Label htmlFor="condition">Condition</Label>

                <Input
                  id="condition"
                  type="text"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 pb-2">
                <Switch
                  id="foil"
                  checked={foil}
                  onCheckedChange={setFoil}
                  disabled={!canFoil}
                />

                <Label
                  htmlFor="foil"
                  className="flex cursor-pointer items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Foil
                </Label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={submit} className="flex-1">
                Save changes
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => setShowStyles((value) => !value)}
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
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading printings…
              </div>
            )}

            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {(printings?.data ?? []).map((printing) => {
                const isActive = printing.id === selected.id;

                return (
                  <button
                    key={printing.id}
                    type="button"
                    onClick={() => setSelected(printing)}
                    className={cn(
                      `group space-y-1 rounded-xl p-1 text-left transition`,
                      isActive ? "ring-2 ring-primary" : "hover:bg-muted/40",
                    )}
                  >
                    <CardImage
                      src={cardImage(printing, "small")}
                      alt={printing.name}
                    />

                    <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
                      <div className="font-medium text-foreground">
                        {printing.set!.toUpperCase()} #
                        {printing.collector_number}
                      </div>

                      <div className="line-clamp-2">
                        {styleLabel(printing) || printing.set_name}
                      </div>
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
