import { Button } from "#/components/ui/button";
import { Textarea } from "#/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { api } from "#/api/manabyte";
import type { Card } from "#/lib/types";
import type { ResolvedRow } from "../deckCards/importDialog";
import { Dialog, DialogContent } from "../ui/dialog";
import { CardPicker } from "../dialogs/Base/CardPicker";

export interface ImportData {
  cards: Card[];
  extra: {
    foil: boolean;
    quantity: number;
  };
  warning?: string;
}

export function check(text: string) {
  return api<ImportData[]>("/imports/", {
    method: "POST",
    body: JSON.stringify({ content: text }),
  });
}

export function useCheckImport() {
  return useMutation({
    mutationFn: (data: string) => check(data),
    onError: (error) => {
      toast.error(String(error));
    },
  });
}

type SelectedImportCard = {
  card: Card;
  quantity: number;
  foil: boolean;
};

export function NormalImport({
  onConfirm,
  confirmLabel,
  onChangeOpen,
}: {
  confirmLabel: string;
  onConfirm: (rows: ResolvedRow[]) => Promise<void>;
  onChangeOpen: (value: boolean) => void;
}) {
  const [selectedCards, setSelectedCards] = useState<
    Record<number, SelectedImportCard>
  >({});

  const [picker, setPicker] = useState<{
    index: number;
    cards: Card[];
  } | null>(null);

  const [result, setResult] = useState<ImportData[] | null>(null);
  const [text, setText] = useState("");
  const checkImport = useCheckImport();

  const busy = checkImport.isPending;

  async function review() {
    if (!text.trim()) return;

    try {
      const response = await checkImport.mutateAsync(text);
      setResult(response);
      setSelectedCards({});
    } catch {
      // Error toast handled by the mutation.
    }
  }

  async function confirm() {
    if (!result) return;

    const rows: ResolvedRow[] = [];

    for (const [index, item] of result.entries()) {
      const selected = selectedCards[index];

      if (selected) {
        rows.push({
          quantity: selected.quantity,
          foil: selected.foil,
          scryfall_id: selected.card.external_id,
        });

        continue;
      }

      if (item.cards.length === 1) {
        const card = item.cards[0];

        rows.push({
          quantity: item.extra.quantity,
          foil: item.extra.foil,
          scryfall_id: card.external_id,
        });

        continue;
      }

      // No hay coincidencias o el usuario todavía no ha elegido.
      toast.warning(`Please select a card for line ${index + 1}`);
      return;
    }

    try {
      await onConfirm(rows);
      onChangeOpen(false);
    } catch (error) {
      toast.error("Failed to import cards");
      console.error(error);
    }
  }

  const warningResult = result?.flatMap((item, index) =>
    item.warning ? [{ ...item, originalIndex: index }] : [],
  );

  return (
    <>
      <div className="flex max-h-[85vh] flex-col">
        <div className="overflow-y-auto px-6 py-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                rows={10}
                value={text}
                placeholder="4 Horn of Gondor (LTR) 240"
                onChange={(e) => {
                  setText(e.target.value);
                  setResult(null);
                }}
                className="min-h-56 resize-y border-border bg-background font-mono text-sm leading-relaxed placeholder:text-muted-foreground/60"
              />

              <p className="text-xs leading-relaxed text-muted-foreground">
                One card per line. Quantity, set code and collector number are
                optional.
              </p>
            </div>

            {warningResult && (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-2">
                {warningResult.map((item) => {
                  const index = item.originalIndex;
                  const selected = selectedCards[index];

                  return (
                    <button
                      key={`${item.cards[0]?.id ?? "unmatched"}-${index}`}
                      type="button"
                      disabled={item.cards.length === 0}
                      onClick={() => {
                        setPicker({
                          index,
                          cards: item.cards,
                        });
                      }}
                      className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {selected ? (
                        <>
                          <img
                            src={selected.card.card_faces[0]?.image_url}
                            alt={selected.card.name}
                            className="h-16 w-12 rounded object-contain"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{selected.card.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {selected.card.set.name} · #
                              {selected.card.collector_number}
                            </p>
                            <p className="text-xs text-primary">Selected</p>
                          </div>
                        </>
                      ) : (
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">
                            {item.cards[0]?.name ?? "Unmatched card"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.cards.length} candidates · Click to choose
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {result !== null && warningResult?.length === 0 && (
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Everything looks good!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    All cards were matched successfully. You're ready to import.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-6 py-4">
          <Button
            onClick={review}
            disabled={busy || !text.trim()}
            variant={result !== null ? "outline" : "default"}
          >
            {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {result !== null ? "Check again" : "Check list"}
          </Button>

          {result !== null && result.some((item) => item.cards.length > 0) && (
            <Button onClick={confirm} disabled={busy}>
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>

      <CardPickerDialog
        open={picker !== null}
        onOpenChange={(open) => {
          if (!open) setPicker(null);
        }}
        cards={picker?.cards ?? []}
        onSelect={(card) => {
          if (picker === null) return;

          const index = picker.index;
          const item = result?.[index];

          if (!item) return;

          setSelectedCards((previous) => ({
            ...previous,
            [index]: {
              card,
              quantity: item.extra.quantity,
              foil: item.extra.foil,
            },
          }));

          setPicker(null);
        }}
      />
    </>
  );
}

export function CardPickerDialog({
  open,
  onOpenChange,
  cards,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cards: Card[];
  onSelect: (card: Card) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto p-4 sm:max-w-5xl">
        <CardPicker
          cards={cards}
          onSelect={onSelect}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>
  );
}
