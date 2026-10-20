import { useEffect, useState } from "react";

import { CardImage } from "#/components/deckCards/cardImage";
import ManaCost from "#/components/search/manaCost";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/labels";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";

import type { CreateDeckCardData } from "#/features/deckCards/types";
import {
  ZONE_FORMAT,
  type Deck,
  type ZoneFormat,
} from "#/features/decks/types";
import type { Card } from "#/lib/types";
import { cn } from "#/lib/utils";

import { Layers } from "lucide-react";

export default function AddCardToDeck({
  card,
  decks,
  printings,
  showStyles,
  onCreate,
  onClose,
  onShowStyles,
  onChangeCard,
}: {
  card: Card;
  decks: Deck[];
  printings: Card[];
  showStyles: boolean;
  onCreate: (data: CreateDeckCardData, deckId: number) => void;
  onClose?: () => void;
  onShowStyles: (value: boolean) => void;
  onChangeCard: (card: Card) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [zone, setZone] = useState<ZoneFormat>("mainboard");
  const [deckId, setDeckId] = useState<number>(decks[0]?.id ?? 0);

  useEffect(() => {
    setQuantity(1);
    setZone("mainboard");
  }, [card]);

  useEffect(() => {
    setDeckId((current) =>
      decks.some((deck) => deck.id === current) ? current : (decks[0]?.id ?? 0),
    );
  }, [decks]);

  function submit() {
    if (!decks.some((deck) => deck.id === deckId)) return;

    onCreate(
      {
        scryfall_id: card.external_id,
        quantity: Math.max(1, quantity),
        zone,
      },
      deckId,
    );

    onClose?.();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-semibold">{card.name}</h2>

        <ManaCost cost={card.card_faces[0].mana_cost} />
      </div>

      <p className="text-sm text-muted-foreground">
        {card.set.name} ({card.set.code?.toUpperCase()}) #
        {card.collector_number} · {card.rarity}
      </p>

      <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
        <div className="mx-auto w-full max-w-[200px]">
          <CardImage
            card={card.card_faces}
            layout={card.layout}
            alt={card.name}
          />
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-4">
            <div className="w-24 space-y-2">
              <Label htmlFor="deck-card-quantity">Quantity</Label>

              <Input
                id="deck-card-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>

            <div className="w-35 space-y-2">
              <Label htmlFor="deck-card-zone">Zone</Label>

              <Select
                value={zone}
                onValueChange={(value) => setZone(value as ZoneFormat)}
              >
                <SelectTrigger id="deck-card-zone">
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

            <div className="w-35 space-y-2">
              <Label htmlFor="deck-card-deck">Deck</Label>

              <Select
                value={deckId ? String(deckId) : ""}
                onValueChange={(value) => setDeckId(Number(value))}
                disabled={decks.length === 0}
              >
                <SelectTrigger id="deck-card-deck">
                  <SelectValue placeholder="Select deck" />
                </SelectTrigger>

                <SelectContent>
                  {decks.map((deck) => (
                    <SelectItem key={deck.id} value={String(deck.id)}>
                      {deck.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => onShowStyles(!showStyles)}
            >
              <Layers className="mr-2 h-4 w-4" />
              {showStyles ? "Hide styles" : "Other styles"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={submit}
              className="flex-1"
              disabled={decks.length === 0}
            >
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

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {printings.map((printing) => {
              const isActive = printing.external_id === card.external_id;

              return (
                <button
                  key={printing.external_id}
                  type="button"
                  onClick={() => onChangeCard(printing)}
                  aria-pressed={isActive}
                  className={cn(
                    "group space-y-1 rounded-xl p-1 text-left transition",
                    isActive ? "ring-2 ring-primary" : "hover:bg-muted/40",
                  )}
                >
                  <CardImage
                    card={printing.card_faces}
                    layout={printing.layout}
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
