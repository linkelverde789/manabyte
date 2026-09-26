import type { Deck } from "#/features/decks/types";
import { Link } from "@tanstack/react-router";
import { Layers, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

export default function DeckRow({
  deck,
  onDelete,
}: {
  deck: Deck;
  onDelete: (deckId: string) => void;
}) {
  return (
    <div
      key={deck.id}
      className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
    >
      <Link
        to="/decks/$deckId"
        params={{ deckId: deck.id }}
        className="block space-y-2 pr-8"
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
          <Layers className="h-3.5 w-3.5" /> {deck.format}
        </div>
        <div className="text-lg font-semibold">{deck.name}</div>
        <div className="text-sm text-muted-foreground">
          {deck.card_count} cards
        </div>
      </Link>
      <Button
        size="icon"
        variant="ghost"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={() => onDelete(deck.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
