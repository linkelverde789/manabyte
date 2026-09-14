import { cn } from "@/lib/utils";

function symbolUrl(symbol: string) {
    const code = symbol.replace(/[{}]/g, "").replace(/\//g, "");
    return `https://svgs.scryfall.io/card-symbols/${code.toUpperCase()}.svg`;
}

export default function ManaCost({ cost, className }: { cost?: string | undefined; className?: string | undefined }) {
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