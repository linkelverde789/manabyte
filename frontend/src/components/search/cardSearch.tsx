import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useScryfall } from "#/hooks/use-scryfall";
import type { ScryfallCard, ScryfallCards } from "#/types/scryfall";
import SearchResults from "../index/searchResult";

export default function CardSearch({ autoFocus }: {
    autoFocus?: boolean | undefined;
}) {
    const [text, setText] = useState("")
    const [debounced, setDebounced] = useState("")
    const [picked, setPicked] = useState<ScryfallCard | null>(null)

    useEffect(() => {
        const t = setTimeout(() => setDebounced(text.trim()), 350)
        return () => clearTimeout(t)
    }, [text])

    const { data: results, isFetching } = useScryfall<{ data: ScryfallCards }>(`/cards/search?q=${encodeURIComponent(debounced)}&unique=true&order=name&include_extras=false`)

    return (
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
                {isFetching && (
                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                )}
            </div>

            {debounced.length >= 2 && !isFetching && (results?.data?.length ?? 0) === 0 && (
                <p className="text-sm text-muted-foreground">No cards found for “{debounced}”.</p>
            )}

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                <SearchResults cards={results?.data} onPicked={setPicked} />
            </div>
        </div>
    );
}