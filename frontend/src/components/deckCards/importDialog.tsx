import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";

import { X, AlertTriangle, Check, ClipboardList, Loader2 } from "lucide-react";

import { useState } from "react";

import { parseDecklist } from "#/features/deckCards/decklist";
import type { ScryfallCard } from "#/features/scryfall/types";

import { useLoadCollection } from "#/features/scryfall/hooks";
import { searchCardFuzzy } from "#/features/scryfall/api";

interface ResolvedRow {
  quantity: number;
  foil?: boolean;
  card: ScryfallCard;
}

export interface ParsedLine {
  raw: string;
  quantity: number;
  name: string;
  set?: string;
  collectorNumber?: string;
  foil?: boolean;
}

export function ImportDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  trigger,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: (rows: ResolvedRow[]) => Promise<void>;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const { mutateAsync: loadCollection } = useLoadCollection();

  const [result, setResult] = useState<{
    resolved: ResolvedRow[];
    failed: ParsedLine[];
  } | null>(null);

  async function confirm() {
    if (!result) {
      return;
    }

    setBusy(true);

    try {
      await onConfirm(result.resolved);

      setOpen(false);
      setResult(null);
      setText("");
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  }

  async function review() {
    const lines = parseDecklist(text);

    if (!lines.length) {
      console.error("Paste at least one card line first.");
      return;
    }

    setBusy(true);

    try {
      const result = await resolveLines(lines, loadCollection);

      setResult(result);
    } catch (error) {
      console.error(error);
    } finally {
      setBusy(false);
    }
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setResult(null);
      setText("");
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <ClipboardList className="mr-2 h-4 w-4" />
            Paste list
          </Button>
        )}
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px]" />

        <DialogContent className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-border bg-background p-0 shadow-2xl focus:outline-none">
          <div className="flex max-h-[85vh] flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
              <div className="min-w-0 space-y-1">
                <DialogTitle className="text-lg font-semibold tracking-tight">
                  {title}
                </DialogTitle>

                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </DialogDescription>
              </div>

              <DialogClose asChild>
                <button
                  type="button"
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </DialogClose>
            </div>

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
                    One card per line. Quantity, set code and collector number
                    are optional. Spanish names work too.
                  </p>
                </div>

                {/* Result */}
                {result && (
                  <div className="rounded-lg border border-border bg-muted/20">
                    {/* Result header */}
                    <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                      <Check className="h-4 w-4 text-primary" />

                      <span className="text-sm font-medium">
                        {result.resolved.length} lines matched
                      </span>

                      <span className="text-sm text-muted-foreground">
                        (
                        {result.resolved.reduce(
                          (sum, row) => sum + row.quantity,
                          0,
                        )}{" "}
                        cards)
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
                          key={`${row.card.id}-${index}`}
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
                )}
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
                <Button
                  onClick={confirm}
                  disabled={!result.resolved.length || busy}
                >
                  {confirmLabel}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

async function resolveLines(
  lines: ParsedLine[],
  loadCollection: ReturnType<typeof useLoadCollection>["mutateAsync"],
) {
  const resolved: ResolvedRow[] = [];
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
          card,
          foil: line.foil,
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
        });
      } else {
        failed.push(line);
      }
    } catch (error) {
      console.error("Error buscando carta:", error);
      failed.push(line);
    }
  }

  return {
    resolved,
    failed,
  };
}
