import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useScryfall } from "#/hooks/use-scryfall";
import type { ScryfallCard } from "#/types/scryfall";

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

    const { data: results, isFetching } = useScryfall<{ data: ScryfallCard[] }>(`/cards/search?q=${encodeURIComponent(debounced)}&unique=true&order=name&include_extras=false`)

    console.log("results: ", results)

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
                {(results?.data ?? []).map((card) => (
                    <button
                        key={card.id}
                        type="button"
                        onClick={() => setPicked(card)}
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
                ))}
            </div>
        </div>
    );
}


import { cn } from "@/lib/utils";

function symbolUrl(symbol: string) {
    const code = symbol.replace(/[{}]/g, "").replace(/\//g, "");
    return `https://svgs.scryfall.io/card-symbols/${code.toUpperCase()}.svg`;
}

export function ManaCost({ cost, className }: { cost?: string | undefined; className?: string | undefined }) {
    if (!cost) return null;
    const symbols = cost.match(/\{[^}]+\}/g) ?? [];
    if (!symbols.length) return null;
    return (
        <span className={cn("inline-flex items-center gap-0.5 align-middle", className)}>
            {symbols.map((s, i) => (
                <img
                    key={`${s}-${i}`}
                    src={symbolUrl(s)}
                    alt={s}
                    loading="lazy"
                    className="h-3.5 w-3.5 rounded-full"
                />
            ))}
        </span>
    );
}

const COLOR_CLASS: Record<string, string> = {
    W: "bg-[#f7f0da]",
    U: "bg-[#7fb4dc]",
    B: "bg-[#4a4348]",
    R: "bg-[#e0806e]",
    G: "bg-[#83b98c]",
};

export function ColorPips({ colors }: { colors: string[] }) {
    if (!colors.length) {
        return <span className="text-xs text-muted-foreground">Colorless</span>;
    }
    return (
        <span className="inline-flex items-center gap-1">
            {colors.map((color) => (
                <span
                    key={color}
                    title={color}
                    className={cn("h-2.5 w-2.5 rounded-full ring-1 ring-black/40", COLOR_CLASS[color] ?? "bg-muted")}
                />
            ))}
        </span>
    );
}