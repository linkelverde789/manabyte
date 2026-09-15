import NewDeckDialog from '#/components/decks/newDeckDialog';
import { Button } from '#/components/ui/button';
import { useDecks, useDeleteDeck } from '#/features/decks/hooks';
import { createFileRoute, Link } from '@tanstack/react-router'
import { Layers, Trash2 } from 'lucide-react';

export const Route = createFileRoute('/_authenticated/decks/')({
  component: RouteComponent,
})


function RouteComponent() {
  const { data: decks } = useDecks()

  const deleteDeck = useDeleteDeck()
  function handleDeleteDeck(deckId: number) {
    deleteDeck.mutate(deckId)
  }

  if (!decks) {
    return <div>
      No hay nada
    </div>
  }
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My decks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {decks.length} deck{decks.length === 1 ? "" : "s"} saved.
          </p>
        </div>
        <NewDeckDialog />
      </div>

      {decks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No decks yet. Create one, then paste a list or search cards to fill it.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {decks.map((deck) => {
            const total = deck.card_count;
            return (
              <div
                key={deck.id}
                className="group relative rounded-xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50"
              >
                <Link
                  to="/decks/$deckId"
                  params={{ deckId: deck.id.toLocaleString() }}
                  className="block space-y-2 pr-8"
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" /> {deck.format}
                  </div>
                  <div className="text-lg font-semibold">{deck.name}</div>
                  <div className="text-sm text-muted-foreground">{total} cards</div>

                </Link>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDeleteDeck(deck.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  )
}
