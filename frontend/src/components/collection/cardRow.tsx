import type { ScryfallCard } from "#/features/scryfall/types";
import { Layers, Minus, Plus, Sparkles, Trash2 } from "lucide-react";
import { CardImage } from "../deckCards/cardImage";
import ManaCost from "../search/manaCost";
import { Button } from "../ui/button";
import type { CollectionItem } from "#/features/collection/types";
import {
    useDeleteCollectionItem,
    usePartialUpdateCollectionItem,
} from "#/features/collection/hooks";
import { useState } from "react";
import StylePicker from "../deckCards/stylePicker";

export default function CardRow({
    dataCard,
    card,
}: {
    dataCard: CollectionItem;
    card: ScryfallCard;
}) {
    const partialUpdateCollectorItem = usePartialUpdateCollectionItem();
    const deleteCollectorItem = useDeleteCollectionItem();

    const [openStyles, setOpenStyles] = useState(false);

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
    return (
        <div
            key={card.id}
            className="flex gap-3 rounded-xl border border-border bg-card p-3 shadow-sm"
        >
            <div className="w-20 shrink-0">
                <CardImage src={card.image_uris?.normal} alt={card.name} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                    <div className="line-clamp-2 text-sm font-medium">
                        {card.name}
                    </div>
                    <ManaCost cost={card.mana_cost} />
                </div>
                <div className="text-xs text-muted-foreground">
                    {card.set_name} ({card.set.toUpperCase()}) #
                    {card.collector_number}
                </div>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="hidden text-xs text-muted-foreground sm:inline-flex"
                    onClick={() => setOpenStyles((value) => !value)}
                >
                    <Layers className="mr-1 h-3.5 w-3.5" />

                    {openStyles ? "Hide" : "Styles"}
                </Button>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded bg-muted px-1.5 py-0.5">
                        {dataCard.condition}
                    </span>
                    {dataCard.foil && (
                        <span className="flex items-center gap-1 rounded bg-muted px-1.5 py-0.5 text-primary">
                            <Sparkles className="h-3 w-3" /> Foil
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1 pt-1">
                    <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => handleQuantity(dataCard.quantity - 1)}
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
                        onClick={() => handleQuantity(dataCard.quantity + 1)}
                    >
                        <Plus className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteCollectorItem.mutate(dataCard.id)}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
                {openStyles && (
                    <div className="ml-13 rounded-lg border border-border bg-muted/20 p-3">
                        <div className="text-xs text-muted-foreground">
                            {openStyles && (
                                <StylePicker
                                    card={card}
                                    dataCardId={dataCard.id}
                                    onUpdated={() => console.log("hola")}
                                />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
