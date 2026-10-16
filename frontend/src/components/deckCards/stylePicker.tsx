import { cn } from "#/lib/utils";
import { Loader2 } from "lucide-react";
import { CardImage } from "./cardImage";
import type { Card } from "#/lib/types";
import { useListPrints } from "#/features/utils/hooks";

export default function StylePicker({
  card,
  dataCardId,
  onUpdated,
}: {
  card: Card;
  dataCardId: number;
  onUpdated: (scryfall_id: string, cardId: number) => void;
}) {
  const { data: printings, isLoading } = useListPrints(card.oracle_id);

  return (
    <div className="col-span-full space-y-2 rounded-lg bg-muted/30 p-3">
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading styles…
        </div>
      )}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {(printings ?? []).map((printing) => (
          <button
            key={printing.external_id}
            type="button"
            onClick={() => onUpdated(printing.external_id, dataCardId)}
            className={cn(
              "space-y-1 rounded-lg p-1 text-left transition",
              printing.external_id === card.external_id
                ? "ring-2 ring-primary"
                : "hover:bg-muted/60",
            )}
          >
            <CardImage
              card={printing.card_faces}
              layout={card.layout}
              alt={printing.name}
            />
            <div className="px-0.5 text-[10px] leading-tight text-muted-foreground">
              <div className="font-medium text-foreground">
                {printing.set.code?.toUpperCase()} #{printing.collector_number}
              </div>
              <div className="line-clamp-2">{printing.set.name}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
