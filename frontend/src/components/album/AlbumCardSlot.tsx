import type { CollectionItem } from "#/features/collection/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import { CheckCircle2, Sparkles, Lock } from "lucide-react";
import { CardImage } from "../deckCards/cardImage";

export default function AlbumCardSlot({
  card,
  dataCard,
}: {
  card: ScryfallCard;
  dataCard: CollectionItem | undefined;
}) {
  if (dataCard) {
    return (
      <div className="group flex flex-col items-center gap-1.5">
        <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-border shadow-md transition-transform duration-200 group-hover:-translate-y-1">
          <CardImage
            card={card}
            alt={card.name}
            foil={dataCard.foil}
            className="aspect-[488/680] w-full object-cover"
          />

          {dataCard.foil && (
            <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold text-amber-300 backdrop-blur">
              <Sparkles className="h-3 w-3" />
              Foil
            </span>
          )}

          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium text-emerald-300 backdrop-blur">
            <CheckCircle2 className="h-3 w-3" />
            {dataCard.condition}
          </span>
        </div>

        <div className="flex w-full items-center justify-between px-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            #{card.collector_number}
          </span>

          <span className="text-xs font-semibold text-amber-300">
            ×{dataCard.quantity}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col items-center gap-1.5 opacity-80">
      <div className="relative w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/30">
        <CardImage
          card={card}
          alt={card.name}
          foil={false}
          className="aspect-[488/680] w-full object-cover grayscale"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex items-center gap-1.5 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 backdrop-blur">
            <Lock className="h-3 w-3" />
            Missing
          </span>
        </div>
      </div>

      <div className="flex w-full items-center justify-between px-0.5">
        <span className="text-xs font-medium text-muted-foreground/60">
          #{card.collector_number}
        </span>

        <span className="text-xs text-muted-foreground/50">—</span>
      </div>
    </div>
  );
}
