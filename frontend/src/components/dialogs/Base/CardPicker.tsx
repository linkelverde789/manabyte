import { CardImage } from "#/components/deckCards/cardImage";
import type { Card } from "#/lib/types";

export function CardPicker({
  cards,
  onSelect,
  onOpenChange,
}: {
  cards: Card[];
  onSelect: (card: Card) => void;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {cards.map((card) => {
        return (
          <button
            key={card.id}
            type="button"
            onClick={() => {
              onSelect(card);
              onOpenChange(false);
            }}
            className="group min-w-0 rounded-lg text-left transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CardImage
              card={card.card_faces}
              alt={card.name}
              foil={false}
              layout={card.layout}
              className="aspect-[488/680] w-full rounded-lg object-contain transition-transform group-hover:scale-[1.02]"
            />

            <p className="mt-2 truncate text-center text-xs text-muted-foreground">
              {card.set.name} · #{card.collector_number}
            </p>
          </button>
        );
      })}
    </div>
  );
}
