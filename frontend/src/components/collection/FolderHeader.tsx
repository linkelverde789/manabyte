import type { CollectionItem } from "#/features/collection/types";
import type { ScryfallCard } from "#/features/scryfall/types";
import { ImportDialog } from "../deckCards/importDialog";

export function FolderHeader({
  folderName,
  total,
  entries,
  onImport,
}: {
  folderName?: string;
  total: number;
  entries: { card: ScryfallCard; dataCard: CollectionItem }[];
  onImport: (rows: any[]) => Promise<void>;
}) {
  const prices =
    entries?.reduce((acc, item) => {
      const { card, dataCard } = item || {};
      if (!card || !dataCard) return acc;

      const quantity = dataCard.quantity || 0;
      const price = parseFloat(
        card.prices?.[dataCard.foil ? "usd_foil" : "usd"] || "0",
      );

      return acc + quantity * price;
    }, 0) ?? 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {folderName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} cards · {entries.length} entries
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportDialog
            title="Paste a list into collection"
            description="Import cards from a decklist. One card per line."
            confirmLabel="Add to collection"
            onConfirm={onImport}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Collection value
        </p>
        <p className="text-2xl font-semibold text-primary">
          ${prices.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
