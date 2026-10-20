import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

const SYNTAX_ROWS: Array<{ tokens: string[]; text: string }> = [
  {
    tokens: ["type:human", "t:creature"],
    text: "Filter by card type or subtype",
  },

  {
    tokens: ["set:m20", "set:rings", "set:fdn"],
    text: "Only cards from a specific set",
  },
  { tokens: ["set_code:khm"], text: "Filter by set code" },
  { tokens: ["set_name:foundations"], text: "Filter by set name" },
  { tokens: ["name:lightning bolt"], text: "Filter by card name" },
  { tokens: ["keywords:trample"], text: "Filter by keywords" },
  { tokens: ["rarity:common", "r:uncommon"], text: "Filter by rarity" },
  { tokens: ["color:w", "c:u"], text: "Filter by color" },
  { tokens: ["oracle:hexproof"], text: "Search rules text for keywords" },
  { tokens: ["text:draw"], text: "Search in card text (name, rules, etc.)" },
  {
    tokens: ["type:artifact t:soldier"],
    text: "Combine type and subtype filters",
  },
];

export function SearchSyntax() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex justify-center">
        <CollapsibleTrigger className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground">
          <Info className="h-3.5 w-3.5" />
          Search syntax
          <ChevronDown className="h-3 w-3 transition-transform group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="mx-auto mt-3 max-w-2xl space-y-1.5 rounded-xl border border-border/60 bg-card/40 px-5 py-4">
          {SYNTAX_ROWS.map((row) => (
            <div
              key={row.text}
              className="flex flex-wrap items-baseline gap-x-2 text-sm"
            >
              <span className="shrink-0">
                {row.tokens.map((token, i) => (
                  <span key={token}>
                    {i > 0 && (
                      <span className="text-muted-foreground/60"> / </span>
                    )}
                    <code className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-accent">
                      {token}
                    </code>
                  </span>
                ))}
              </span>
              <span className="text-xs text-muted-foreground">{row.text}</span>
            </div>
          ))}
          <p className="pt-2 text-xs text-muted-foreground/80">
            Full reference at{" "}
            <a
              href="https://scryfall.com/docs/syntax"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              scryfall.com/docs/syntax
            </a>
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
