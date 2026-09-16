import { useSearchCardStyles } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
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
import { cardImage, styleLabel } from "./stylePicker";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Layers, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { useCreateDeckCard } from "#/features/deckCards/hooks";
import { cn } from "#/lib/utils";

export function AddCardDialog({
    card,
    open,
    onOpenChange,
    deckId,
}: {
    card: ScryfallCard | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    deckId: string | number;
}) {
    const [selected, setSelected] = useState<ScryfallCard | null>(card);
    const [showStyles, setShowStyles] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setSelected(card);
        setShowStyles(false);
        setQuantity(1);
    }, [card, deckId]);

    const { data: printings, isLoading } = useSearchCardStyles(
        selected?.name ?? "",
    );
    const createCard = useCreateDeckCard(deckId);
    if (!card || !selected) return null;

    function submit() {
        createCard.mutate({ scryfall_id: selected?.id!, quantity: quantity });
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
                        {selected.name} <ManaCost cost={selected.mana_cost} />
                    </DialogTitle>
                    <DialogDescription>
                        {selected.set_name} ({selected.set.toUpperCase()}) #
                        {selected.collector_number} · {selected.rarity}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
                    <CardImage src={cardImage(selected)} alt={selected.name} />

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
                                        setQuantity(
                                            Math.max(
                                                1,
                                                Number(e.target.value) || 1,
                                            ),
                                        )
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
                            Pick the printing you want — each style is stored
                            separately.
                        </p>
                        {isLoading && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                Loading printings…
                            </div>
                        )}
                        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                            {(printings?.data ?? []).map((p) => {
                                const isActive = p.id === selected.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelected(p)}
                                        className={cn(
                                            "group space-y-1 rounded-xl p-1 text-left transition",
                                            isActive
                                                ? "ring-2 ring-primary"
                                                : "hover:bg-muted/40",
                                        )}
                                    >
                                        <CardImage
                                            src={cardImage(p, "small")}
                                            alt={p.name}
                                        />
                                        <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
                                            <div className="font-medium text-foreground">
                                                {p.set.toUpperCase()} #
                                                {p.collector_number}
                                            </div>
                                            <div className="line-clamp-2">
                                                {styleLabel(p) || p.set_name}
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
