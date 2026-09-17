import ManaCost from "#/components/search/manaCost";
import { Button } from "#/components/ui/button";
import {
    useDeleteDeckCard,
    usePartialUpdateDeckCard,
} from "#/features/deckCards/hooks";
import type { DeckCard } from "#/features/deckCards/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import { cn } from "#/lib/utils";
import { Layers, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { CardImage } from "./cardImage";
import StylePicker from "./stylePicker";

export default function CardRow({
    card,
    dataCard,
    deckId,
}: {
    card: ScryfallCard;
    dataCard: DeckCard;
    deckId: number | string;
}) {
    const [openStyles, setOpenStyles] = useState(false);

    const deleteCard = useDeleteDeckCard(deckId);
    const updateCard = usePartialUpdateDeckCard(deckId);

    const isUpdating = deleteCard.isPending || updateCard.isPending;

    function handleUpdate(scryfall_id: string, cardId: string | number) {
        updateCard.mutate({
            cardId: cardId,
            data: { scryfall_id: scryfall_id },
        });
    }

    function handleUpdateQuantity(quantity: number) {
        if (isUpdating) {
            return;
        }

        if (quantity < 1) {
            deleteCard.mutate(dataCard.id);
            return;
        }

        if (quantity === dataCard.quantity) {
            return;
        }

        updateCard.mutate({
            cardId: dataCard.id,
            data: {
                quantity,
            },
        });
    }

    function handleDelete() {
        if (isUpdating) {
            return;
        }

        deleteCard.mutate(dataCard.id);
    }

    return (
        <div className="space-y-2">
            <div
                className={cn(
                    "flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
                    "transition-colors hover:bg-muted/30",
                    isUpdating && "pointer-events-none opacity-60",
                )}
            >
                <div className="w-10 shrink-0">
                    <CardImage
                        src={card.image_uris?.normal}
                        alt={card.name}
                        className="rounded-md"
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="line-clamp-1 text-sm font-medium">
                            {card.name}
                        </span>

                        {card.mana_cost && <ManaCost cost={card.mana_cost} />}
                    </div>

                    <div className="text-xs uppercase text-muted-foreground">
                        {card.set} #{card.collector_number}
                    </div>
                </div>

                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="hidden text-xs text-muted-foreground sm:inline-flex"
                    onClick={() => setOpenStyles((value) => !value)}
                    disabled={isUpdating}
                >
                    <Layers className="mr-1 h-3.5 w-3.5" />

                    {openStyles ? "Hide" : "Styles"}
                </Button>

                <div className="flex shrink-0 items-center gap-1">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                            handleUpdateQuantity(dataCard.quantity - 1)
                        }
                        disabled={isUpdating}
                        aria-label={`Remove one ${card.name} `}
                    >
                        <Minus className="h-3.5 w-3.5" />
                    </Button>

                    <span
                        className="w-6 text-center text-sm font-medium"
                        aria-label={`Quantity: ${dataCard.quantity} `}
                    >
                        {dataCard.quantity}
                    </span>

                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() =>
                            handleUpdateQuantity(dataCard.quantity + 1)
                        }
                        disabled={isUpdating}
                        aria-label={`Add one ${card.name} `}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>

                    <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={handleDelete}
                        disabled={isUpdating}
                        aria-label={`Delete ${card.name} `}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            {openStyles && (
                <div className="ml-13 rounded-lg border border-border bg-muted/20 p-3">
                    <div className="text-xs text-muted-foreground">
                        {openStyles && (
                            <StylePicker
                                card={card}
                                dataCardId={dataCard.id}
                                onUpdated={handleUpdate}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
