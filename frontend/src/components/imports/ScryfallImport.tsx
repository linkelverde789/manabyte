import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

import { Loader2 } from "lucide-react";

import { useState } from "react";

import { parseDecklist } from "#/features/deckCards/decklist";
import type { ScryfallCard } from "#/features/scryfall/types";

import { useLoadCollection } from "#/features/scryfall/hooks";
import { searchCardFuzzy } from "#/features/scryfall/api";
import { toast } from "sonner";
import type {
  ResolvedRow,
  ResolvedRowScryfall,
} from "#/features/imports/types";
import { ScryfallImportResult } from "../utils/ScryfallImportResult";
import type { ParsedLine } from "#/features/utils/types";

export function ScryfallImport({
  onConfirm,
  confirmLabel,
  onChangeOpen,
}: {
  confirmLabel: string;
  onConfirm: (rows: ResolvedRow[]) => Promise<void>;
  onChangeOpen: (value: boolean) => void;
}) {
  const [result, setResult] = useState<{
    resolved: ResolvedRowScryfall[];
    failed: ParsedLine[];
  } | null>(null);

  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const { mutateAsync: loadCollection } = useLoadCollection();

  async function confirm() {
    if (!result) {
      return;
    }

    setBusy(true);

    try {
      await onConfirm(result.resolved);

      onChangeOpen(false);
      setResult(null);
      setText("");
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setBusy(false);
    }
  }

  async function review() {
    const lines = parseDecklist(text);

    if (!lines.length) {
      toast.error("Paste at least one card line first.");
      return;
    }

    setBusy(true);

    try {
      const result = await resolveLines(lines, loadCollection);

      setResult(result);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex max-h-[85vh] flex-col">
      {/* Body */}
      <div className="overflow-y-auto px-6 py-5">
        <div className="space-y-4">
          {/* Textarea */}
          <div className="space-y-2">
            <Textarea
              rows={10}
              value={text}
              placeholder={`4 Cuerno de Gondor (LTR) 240`}
              onChange={(e) => setText(e.target.value)}
              className="min-h-56 resize-y border-border bg-background font-mono text-sm leading-relaxed placeholder:text-muted-foreground/60"
            />

            <p className="text-xs leading-relaxed text-muted-foreground">
              One card per line. Quantity, set code and collector number are
              optional. Spanish names work too.
            </p>
          </div>

          {/* Result */}
          {result && <ScryfallImportResult result={result} />}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
        <Button
          onClick={review}
          disabled={busy || !text.trim()}
          variant={result ? "outline" : "default"}
        >
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

          {result ? "Check again" : "Check list"}
        </Button>

        {result && (
          <Button onClick={confirm} disabled={!result.resolved.length || busy}>
            {confirmLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

async function resolveLines(
  lines: ParsedLine[],
  loadCollection: ReturnType<typeof useLoadCollection>["mutateAsync"],
) {
  const resolved: ResolvedRowScryfall[] = [];
  const failed: ParsedLine[] = [];

  const withCode = lines.filter((line) => line.set && line.collectorNumber);

  const withoutCode = lines.filter(
    (line) => !line.set || !line.collectorNumber,
  );

  if (withCode.length > 0) {
    const identifiers = withCode.map((line) => ({
      set: line.set!,
      collector_number: line.collectorNumber!,
    }));

    const results = await loadCollection(identifiers);

    const byKey = new Map<string, ScryfallCard>();

    for (const card of results.data) {
      byKey.set(`${card.set}:${card.collector_number}`.toLowerCase(), card);
    }

    for (const line of withCode) {
      const card = byKey.get(
        `${line.set}:${line.collectorNumber}`.toLowerCase(),
      );

      if (card) {
        resolved.push({
          quantity: line.quantity,
          foil: line.foil,
          card,
          scryfall_id: card.id,
        });
      } else {
        failed.push(line);
      }
    }
  }

  for (const line of withoutCode) {
    try {
      const card = await searchCardFuzzy(line.name);

      if (card) {
        resolved.push({
          quantity: line.quantity,
          card,
          foil: line.foil,
          scryfall_id: card.id,
        });
      } else {
        failed.push(line);
      }
    } catch (error) {
      toast.error(`Error searching card: ${error}`);
      failed.push(line);
    }
  }

  return {
    resolved,
    failed,
  };
}
