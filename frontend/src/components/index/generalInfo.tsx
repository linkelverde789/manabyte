import { Layers, Search, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { useRandomCard } from "#/features/scryfall/hooks";
import type { ScryfallCard } from "#/features/scryfall/types";

function formatCardReference(card?: ScryfallCard) {
  if (!card) return "Lightning Bolt(STA) 42";

  return `${card.name} (${card.set?.toUpperCase()}) ${card.collector_number}`;
}

export default function GeneralInfo(props: { userLogged: boolean }) {
  const { data: card } = useRandomCard();

  return (
    <section className="space-y-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs uppercase tracking-widest text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by Scryfall
      </span>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
        Build decks and track every card you own.
      </h1>
      <p className="max-w-2xl text-muted-foreground">
        Paste a decklist like{" "}
        <code className="text-foreground">4 {formatCardReference(card)} </code>{" "}
        or search card by card. Expand any card to pick its showcase, borderless
        or promo style — you can own the same card in as many versions as you
        like.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to={props.userLogged ? "/decks" : "/auth"}>
            <Layers className="mr-2 h-4 w-4" />
            {props.userLogged ? "My decks" : "Build your decks"}
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/search">
            <Search className="mr-2 h-4 w-4" /> Search cards
          </Link>
        </Button>
      </div>
    </section>
  );
}
