import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, Library, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ScryfallCard } from "#/types/scryfall";
import { useScryfall } from "#/hooks/use-scryfall";
import { useAuth } from "#/contexts/AuthContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ManaByte — Magic deck & collection builder" },
      {
        name: "description",
        content:
          "Build Magic: The Gathering decks by pasting a list or searching cards, track your collection and choose any alternate printing.",
      },
      { property: "og:title", content: "ManaByte — Magic deck & collection builder" },
      {
        property: "og:description",
        content:
          "Paste a decklist or search cards, pick alternate styles and track everything you own.",
      },
    ],
  }),
  component: Index,
});

function formatCardReference(card?: ScryfallCard) {
  if (!card) return 'Lightning Bolt(STA) 42'

  return `${card.name} (${card.set.toUpperCase()}) ${card.collector_number}`
}

function Index() {

  const { data: card } =
    useScryfall<ScryfallCard>('/cards/random')

  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <section className="space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by Scryfall
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Build decks and track every card you own.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Paste a decklist like <code className="text-foreground">4 {formatCardReference(card)} </code>{" "}
          or search card by card. Expand any card to pick its showcase, borderless or promo style —
          you can own the same card in as many versions as you like.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to={user ? "/decks" : "/auth"}>
              <Layers className="mr-2 h-4 w-4" />
              {user ? "My decks" : "Build your decks"}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/search">
              <Search className="mr-2 h-4 w-4" /> Search cards
            </Link>
          </Button>
        </div>
      </section>

      {user ? userDisplay(0, 0) : noUserDisplay()}
    </div>
  );
}


function noUserDisplay() {
  return (
    <section className="mt-16 grid gap-4 sm:grid-cols-3">
      <Link
        to="/auth"
        className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
      >
        <Search className="h-5 w-5 text-primary" />
        <div className="mt-3 text-3xl font-semibold">Explore all printings</div>
        <div className="text-sm text-muted-foreground">
          Search every set.
        </div>
      </Link>

      <Link
        to="/auth"
        className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
      >
        <Layers className="h-5 w-5 text-primary" />
        <div className="mt-3 text-3xl font-semibold">Build your decks</div>
        <div className="text-sm text-muted-foreground">
          Create and manage your decks.
        </div>
      </Link>

      <Link
        to="/auth"
        className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
      >
        <Library className="h-5 w-5 text-primary" />
        <div className="mt-3 text-3xl font-semibold">Track your collection</div>
        <div className="text-sm text-muted-foreground">
          Keep track of your cards.
        </div>
      </Link>
    </section>
  )
}

function userDisplay(decksCount: number, cardsInCollection: number) {
  return <section className="mt-16 grid gap-4 sm:grid-cols-3">
    <Link
      to="/search"
      className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
    >
      <Search className="h-5 w-5 text-primary" />
      <div className="mt-3 text-3xl font-semibold">All sets</div>
      <div className="text-sm text-muted-foreground">searchable printings</div>
    </Link>
    <Link
      to="/decks"
      className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
    >
      <Layers className="h-5 w-5 text-primary" />
      <div className="mt-3 text-3xl font-semibold">{decksCount}</div>
      <div className="text-sm text-muted-foreground">decks saved</div>
    </Link>
    <Link
      to="/collection"
      className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
    >
      <Library className="h-5 w-5 text-primary" />
      <div className="mt-3 text-3xl font-semibold">{cardsInCollection}</div>
      <div className="text-sm text-muted-foreground">cards in your collection</div>
    </Link>
  </section>
}