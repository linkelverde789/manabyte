import CardRow from "#/components/collection/cardRow";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { useGetCollectionItems } from "#/features/collection/hooks";
import { useLoadCollection } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";
import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/collection")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: collectionItems } = useGetCollectionItems();

  const [collection, setCollection] = useState<Record<string, ScryfallCard>>(
    {},
  );
  const [term, setTerm] = useState<string>("");
  const [debounced, setDebounced] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term.trim()), 350);
    return () => clearTimeout(t);
  }, [term]);

  const {
    mutate: loadCollection,
    data: results,
    reset: resetCollection,
  } = useLoadCollection();

  const missingIds = useMemo(() => {
    return (
      collectionItems
        ?.map((card) => card.scryfall_id)
        .filter((id) => !collection[id])
        .map((id) => ({ id })) ?? []
    );
  }, [collectionItems, collection]);

  useEffect(() => {
    if (missingIds.length === 0) {
      return;
    }

    loadCollection(missingIds);
  }, [missingIds, loadCollection]);

  const total = collectionItems
    ?.map((item) => item.quantity)
    .reduce((acc, value) => acc + value, 0);

  useEffect(() => {
    if (!results?.data) {
      return;
    }

    setCollection((previous) => {
      const next = { ...previous };

      for (const card of results.data) {
        next[card.id] = card;
      }

      return next;
    });

    resetCollection();
  }, [results, resetCollection]);

  const deckRows = useMemo(() => {
    const query = debounced.toLowerCase();
    return (
      collectionItems?.flatMap((dataCard) => {
        const card = collection[dataCard.scryfall_id];

        if (!card) {
          return [];
        }

        const matches =
          card.name.toLowerCase().includes(query) ||
          card.set_name.toLowerCase().includes(query);

        if (!matches) {
          return [];
        }

        return [
          {
            card,
            dataCard,
          },
        ];
      }) ?? []
    );
  }, [collectionItems, collection, debounced]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            My collection
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} cards · {collectionItems?.length} entries
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* <ImportDialog
            title="Paste cards into your collection"
            description="One card per line, e.g. 4 Cuerno de Gondor (LTR) 240"
            confirmLabel="Add to collection"
            onConfirm={(imported) =>
              imported.forEach((r) =>
                addToCollection({
                  card: r.card,
                  qty: r.qty,
                  foil: false,
                  condition: "NM",
                  notes: "",
                }),
              )
            }
          /> */}
          <Button asChild>
            <Link to="/search">Search cards</Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Filter by name or set"
          className="max-w-xs"
        />
        <Select>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="qty">Quantity</SelectItem>
            <SelectItem value="set">Set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {deckRows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Paste a list or search for cards to start your
          collection.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deckRows.map(({ card, dataCard }) => (
            <MemoizedCardRow dataCard={dataCard} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}

const MemoizedCardRow = memo(CardRow);
