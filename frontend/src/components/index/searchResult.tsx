import type { ScryfallCard, ScryfallCards } from "#/types/scryfall";
import ManaCost from "../search/manaCost";

export default function SearchResults({ cards, onPicked }: { cards?: ScryfallCards, onPicked: (card: ScryfallCard) => void }) {
    return cards?.map((card) => (
        <button
            key={card.id}
            type="button"
            onClick={() => onPicked(card)}
            className="group space-y-2 rounded-xl text-left transition hover:opacity-95"
        >
            <div className="relative aspect-[488/680] w-full overflow-hidden rounded-xl bg-muted/40 ring-1 ring-border">
                <img
                    src={card.image_uris?.normal || card.card_faces?.[0]?.image_uris?.normal}
                    alt={card.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
            </div>
            <div className="space-y-0.5 px-0.5">
                <div className="line-clamp-1 text-sm font-medium">{card.name}</div>
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="uppercase">{card.set}</span>
                    {card.mana_cost && (
                        <ManaCost cost={card.mana_cost} />
                    )}
                </div>
            </div>
        </button>
    ))
}