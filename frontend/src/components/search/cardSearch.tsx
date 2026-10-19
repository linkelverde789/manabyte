import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import SearchResults from "../index/searchResult";
import type { Card } from "#/lib/types";
import { useCardSearch } from "#/features/utils/hooks";
import { CardPreviewDialog } from "../dialogs/Dialogs/CardPreviewDialog";

export default function CardSearch({
  autoFocus,
}: {
  autoFocus?: boolean | undefined;
}) {
  const [text, setText] = useState("");
  const [debounced, setDebounced] = useState("");
  const [picked, setPicked] = useState<Card | null>(null);
  const [open, setOpen] = useState(false);

  function handlePickCard(card: Card) {
    setPicked(card);
    setOpen(true);
  }

  useEffect(() => {
    const t = setTimeout(() => setDebounced(text.trim()), 350);
    return () => clearTimeout(t);
  }, [text]);

  const { data: results, isLoading } = useCardSearch(debounced);

  return (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={text}
            autoFocus={autoFocus}
            onChange={(e) => setText(e.target.value)}
            placeholder="Search cards by name, e.g. Lightning Bolt"
            className="h-12 pl-10 text-base"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {!isLoading && (!results || (results.length ?? 0)) === 0 && (
          <p className="text-sm text-muted-foreground">
            No cards found for “{debounced}”.
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <SearchResults cards={results} onPickCard={handlePickCard} />
        </div>
      </div>
      {picked && (
        <CardPreviewDialog onOpenChange={setOpen} open={open} card={picked} />
      )}
    </>
  );
}
