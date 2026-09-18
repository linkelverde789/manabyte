import { useSearchCardStyles } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { cn } from "#/lib/utils";
import { Loader2 } from "lucide-react";
import { CardImage } from "./cardImage";

export default function StylePicker({
    card,
    dataCardId,
    onUpdated,
}: {
    card: ScryfallCard;
    dataCardId: string | number;
    onUpdated: (scryfall_id: string, cardId: string | number) => void;
}) {
    const { data: printings, isLoading } = useSearchCardStyles(card.name);

    return (
        <div className="col-span-full space-y-2 rounded-lg bg-muted/30 p-3">
            {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading
                    styles…
                </div>
            )}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {(printings?.data ?? []).map((printing) => (
                    <button
                        key={printing.id}
                        type="button"
                        onClick={() => onUpdated(printing.id, dataCardId)}
                        className={cn(
                            "space-y-1 rounded-lg p-1 text-left transition",
                            printing.id === card.id
                                ? "ring-2 ring-primary"
                                : "hover:bg-muted/60",
                        )}
                    >
                        <CardImage
                            src={cardImage(printing, "small")}
                            alt={printing.name}
                        />
                        <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
                            <div className="font-medium text-foreground">
                                {printing.set.toUpperCase()} #
                                {printing.collector_number}
                            </div>
                            <div className="line-clamp-2">
                                {styleLabel(printing) || printing.set_name}
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export function cardImage(
    card: ScryfallCard,
    size: "small" | "normal" | "large" = "normal",
) {
    return (
        card.image_uris?.[size] ??
        card.card_faces?.[0]?.image_uris?.[size] ??
        undefined
    );
}

export function styleLabel(card: ScryfallCard) {
    const parts: string[] = [];
    const effects = card.frame_effects ?? [];
    if (effects.includes("showcase")) parts.push("Showcase");
    if (effects.includes("extendedart")) parts.push("Extended art");
    if (effects.includes("etched")) parts.push("Etched");
    if (effects.includes("inverted")) parts.push("Inverted");
    if (card.border_color === "borderless") parts.push("Borderless");
    if (card.full_art) parts.push("Full art");
    if (card.promo) parts.push("Promo");
    return parts.join(" · ");
}
