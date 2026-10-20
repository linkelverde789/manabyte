import type { DeckCard } from "#/features/deckCards/types";
import type { Card } from "#/lib/types";
import type { UpdateDeckCard } from "./EditCollectionCard";
import { useEffect, useState } from "react";
import { useListPrints } from "#/features/utils/hooks";

import { Layers, Loader2 } from "lucide-react";

import { cn } from "#/lib/utils";
import ManaCost from "#/components/search/manaCost";
import { CardImage } from "#/components/deckCards/cardImage";
import { Label } from "#/components/ui/labels";
import { Input } from "#/components/ui/input";
import { Button } from "#/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { ZONE_FORMAT, type ZoneFormat } from "#/features/decks/types";
export default function EditCollectionCard({
  card,
  dataCard,
  onUpdate,
  onClose,
}: {
  card: Card | null;
  dataCard: DeckCard | null;
  onUpdate: (data: UpdateDeckCard) => void;
  onClose?: () => void;
}) {
  const { data: printings, isLoading } = useListPrints(card?.oracle_id!);

  const [selected, setSelected] = useState<Card | null>(card);

  const [showStyles, setShowStyles] = useState(false);

  const [quantity, setQuantity] = useState(dataCard?.quantity ?? 1);

  const [zone, setZone] = useState("");

  if (!card || !selected || !dataCard) {
    return null;
  }

  useEffect(() => {
    setSelected(card);
    setShowStyles(false);

    setQuantity(dataCard?.quantity ?? 1);
    setZone(dataCard?.zone ?? false);
  }, [card, dataCard]);

  function submit() {
    onUpdate({
      scryfall_id: selected?.external_id,
      quantity: Math.max(1, quantity),
      zone,
    });

    onClose?.();
  }

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
            <div className="w-35 space-y-2">
              <Label htmlFor="zone">Zone</Label>

              <Select
                value={zone}
                onValueChange={(value) => setZone(value as ZoneFormat)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ZONE_FORMAT.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.charAt(0).toUpperCase() + format.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowStyles((value) => !value)}
            >
              <Layers className="mr-2 h-4 w-4" />

              {showStyles ? "Hide styles" : "Other styles"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button onClick={submit} className="flex-1">
              Save changes
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
