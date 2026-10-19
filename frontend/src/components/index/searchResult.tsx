import type { Card } from "#/lib/types";
import { CardImage } from "../deckCards/cardImage";
import ManaCost from "../search/manaCost";

export default function SearchResults({
  cards,
  onPickCard,
}: {
  cards?: Card[];
  onPickCard: (card: Card) => void;
}) {
  return cards?.map((card) => (
    <button
      key={card.id}
      type="button"
      onClick={() => onPickCard(card)}
      className="group space-y-2 rounded-xl text-left transition hover:opacity-95"
    >
      <div className="relative aspect-[488/680] w-full overflow-hidden rounded-xl bg-muted/40 ring-1 ring-border">
        <CardImage
          card={card.card_faces}
          layout={card.layout}
          alt={card.name}
        />
      </div>
      <div className="space-y-0.5 px-0.5">
        <div className="line-clamp-1 text-sm font-medium">{card.name}</div>
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="uppercase">{card.set.code}</span>
          {card.card_faces[0].mana_cost && (
            <ManaCost cost={card.card_faces[0].mana_cost} />
          )}
        </div>
      </div>
    </button>
  ));
}
