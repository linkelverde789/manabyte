import { useSearchCard } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Loader2, Search } from "lucide-react";
import { CardImage } from "./cardImage";
import ManaCost from "../search/manaCost";
import { AddCardDialog } from "./addCardDialog";
import type { CreateCollectionItemData } from "#/features/collection/types";

export default function CardSearch({
  onCreate,
  placeholder = "Search cards by name, e.g. Lightning Bolt",
  autoFocus,
}: {
  onCreate: (data: CreateCollectionItemData) => void;
  placeholder?: string;
  autoFocus?: boolean | undefined;
}) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const [picked, setPicked] = useState<ScryfallCard | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(t);
  }, [term]);

  const { data: results, isLoading } = useSearchCard(debounced);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          autoFocus={autoFocus}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="h-12 pl-10 text-base"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {debounced.length >= 2 &&
        !isLoading &&
        (results?.data?.length ?? 0) === 0 && (
          <p className="text-sm text-muted-foreground">
            No cards found for “{debounced}”.
          </p>
        )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {(results?.data ?? []).map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => setPicked(card)}
            className="group space-y-2 rounded-xl text-left transition hover:opacity-95"
          >
            <CardImage card={card} alt={card.name} />
            <div className="space-y-0.5 px-0.5">
              <div className="line-clamp-1 text-sm font-medium">
                {card.name}
              </div>
              <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span className="uppercase">{card.set}</span>
                <ManaCost cost={card.mana_cost} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <AddCardDialog
        card={picked}
        open={!!picked}
        onOpenChange={(open) => !open && setPicked(null)}
        onCreate={onCreate}
      />
    </div>
  );
}
