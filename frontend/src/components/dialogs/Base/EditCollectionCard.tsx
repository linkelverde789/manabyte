import { useEffect, useState } from "react";

import type { CollectionItem } from "#/features/collection/types";

import { Layers, Loader2, Sparkles } from "lucide-react";

import { cn } from "#/lib/utils";
import type { Card } from "#/lib/types";
import { useListPrints } from "#/features/utils/hooks";
import ManaCost from "#/components/search/manaCost";
import { CardImage } from "#/components/deckCards/cardImage";
import { Label } from "#/components/ui/labels";
import { Input } from "#/components/ui/input";
import { Switch } from "#/components/ui/switch";
import { Button } from "#/components/ui/button";

export interface UpdateCardData {
  scryfall_id?: string;
  quantity?: number;
}

export interface UpdateDeckCard extends UpdateCardData {
  zone?: string;
}

export interface UpdateCollectionCard extends UpdateCardData {
  foil?: boolean;
  condition?: string;
  language?: string;
  folder?: number;
}

export default function EditCollectionCard({
  card,
  dataCard,
  onUpdate,
  onClose,
}: {
  card: Card | null;
  dataCard: CollectionItem | null;
  onUpdate: (data: UpdateCollectionCard) => void;
  onClose?: () => void;
}) {
  const [selected, setSelected] = useState<Card | null>(card);

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

  const { data: printings, isLoading } = useListPrints(card?.oracle_id!);

  if (!card || !selected || !dataCard) {
    return null;
  }

  function submit() {
    onUpdate({
      scryfall_id: selected?.external_id,
      quantity: Math.max(1, quantity),
      foil,
      condition,
    });

    onClose?.();
  }

  const canFoil = selected.can_foil;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-semibold">{selected.name}</h2>

        <ManaCost cost={selected.card_faces[0].mana_cost} />
      </div>

      <p className="text-sm text-muted-foreground">
        {selected.set.name} ({selected.set.code?.toUpperCase()}) #
        {selected.collector_number} · {selected.rarity}
      </p>

      <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
        <div className="mx-auto w-full max-w-[200px]">
          <CardImage
            card={selected.card_faces}
            layout={card.layout}
            alt={selected.name}
          />
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
            {(printings ?? []).map((printing) => {
              const isActive = printing.external_id === selected.external_id;

              return (
                <button
                  key={printing.external_id}
                  type="button"
                  onClick={() => setSelected(printing)}
                  className={cn(
                    "group space-y-1 rounded-xl p-1 text-left transition",
                    isActive ? "ring-2 ring-primary" : "hover:bg-muted/40",
                  )}
                >
                  <CardImage
                    card={printing.card_faces}
                    layout={card.layout}
                    alt={printing.name}
                  />

                  <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
                    <div className="font-medium text-foreground">
                      {printing.set.code?.toUpperCase()} #
                      {printing.collector_number}
                    </div>

                    <div className="line-clamp-2">{printing.set.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
