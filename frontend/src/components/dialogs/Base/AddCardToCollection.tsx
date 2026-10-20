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
import { Switch } from "#/components/ui/switch";

import type { CreateCollectionItemData } from "#/features/collection/types";
import type { Card } from "#/lib/types";
import { cn } from "#/lib/utils";

import { Layers, Sparkles } from "lucide-react";

type FolderOption = {
  id: number;
  name: string;
};

export default function AddCardToCollection({
  card,
  folders,
  printings,
  showStyles,
  onCreate,
  onClose,
  onShowStyles,
  onChangeCard,
}: {
  card: Card;
  folders: FolderOption[];
  printings: Card[];
  showStyles: boolean;
  onCreate: (data: CreateCollectionItemData) => void;
  onClose?: () => void;
  onShowStyles: (value: boolean) => void;
  onChangeCard: (card: Card) => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("");
  const [foil, setFoil] = useState(false);
  const [folderId, setFolderId] = useState<number | undefined>(folders[0]?.id);

  useEffect(() => {
    setQuantity(1);
    setCondition("");
    setFoil(card.can_foil && !card.can_nonfoil);
    setFolderId((current) =>
      current !== undefined && folders.some((folder) => folder.id === current)
        ? current
        : folders[0]?.id,
    );
  }, [card, folders]);

  const canChangeFoil = card.can_foil && card.can_nonfoil;

  function submit() {
    onCreate({
      scryfall_id: card.external_id,
      quantity: Math.max(1, quantity),
      foil,
      language: "en",
      condition,
      folder_id: folderId,
    });

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
              <Label htmlFor="collection-quantity">Quantity</Label>
              <Input
                id="collection-quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Math.max(1, Number(event.target.value) || 1))
                }
              />
            </div>

            <div className="w-35 space-y-2">
              <Label htmlFor="collection-condition">Condition</Label>
              <Input
                id="collection-condition"
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
              />
            </div>

            <div className="w-60 space-y-2">
              <Label htmlFor="collection-folder">Folder</Label>
              <Select
                value={folderId !== undefined ? String(folderId) : ""}
                onValueChange={(value) => setFolderId(Number(value))}
                disabled={folders.length === 0}
              >
                <SelectTrigger id="collection-folder">
                  <SelectValue placeholder="Select folder" />
                </SelectTrigger>
                <SelectContent>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={String(folder.id)}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Segunda fila */}
            <div className="flex w-full flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                <Switch
                  id="collection-foil"
                  checked={foil}
                  onCheckedChange={setFoil}
                  disabled={!canChangeFoil}
                />
                <Label
                  htmlFor="collection-foil"
                  className="flex cursor-pointer items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Foil
                </Label>
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
          </div>

          <div className="flex gap-2">
            <Button
              onClick={submit}
              className="flex-1"
              disabled={folders.length === 0}
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
