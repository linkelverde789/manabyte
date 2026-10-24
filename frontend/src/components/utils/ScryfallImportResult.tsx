import { AlertTriangle, Check } from "lucide-react";

import { type ParsedLine } from "#/features/deckCards/decklist";
import type { ResolvedRowScryfall } from "#/features/imports/types";

export function ScryfallImportResult({
  result,
}: {
  result: {
    resolved: ResolvedRowScryfall[];
    failed: ParsedLine[];
  };
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Check className="h-4 w-4 text-primary" />

        <span className="text-sm font-medium">
          {result.resolved.length} lines matched
        </span>

        <span className="text-sm text-muted-foreground">
          ({result.resolved.reduce((sum, row) => sum + row.quantity, 0)} cards)
        </span>
      </div>

      {result.failed.length > 0 && (
        <div className="border-b border-border px-4 py-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />

            <div className="min-w-0 space-y-1">
              <p className="text-sm font-medium text-destructive">
                {result.failed.length}{" "}
                {result.failed.length === 1
                  ? "line could not be matched"
                  : "lines could not be matched"}
              </p>

              <ul className="space-y-1 font-mono text-xs text-muted-foreground">
                {result.failed.map((line, index) => (
                  <li key={index} className="break-words">
                    {line.raw.trim()}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Resolved cards */}
      <div className="max-h-56 overflow-y-auto">
        {result.resolved.map((row, index) => (
          <div
            key={`${row.scryfall_id}-${index}`}
            className="flex items-center justify-between gap-4 border-b border-border/50 px-4 py-3 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="w-8 shrink-0 text-right font-mono text-sm text-muted-foreground">
                {row.quantity}×
              </span>

              <span className="truncate text-sm font-medium">
                {row.card.name}
              </span>
            </div>

            <span className="shrink-0 font-mono text-xs uppercase text-muted-foreground">
              {row.card.set} #{row.card.collector_number}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
