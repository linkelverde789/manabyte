import { Link } from "@tanstack/react-router";
import { Search, Layers, Library } from "lucide-react";

export default function AnonymousInfo() {
  return (
    <section className="mt-16 grid gap-4 sm:grid-cols-3">
      <Link
        to="/auth"
        className="rounded-xl border border-border bg-card p-6 transition hover:border-primary/50"
      >
        <Search className="h-5 w-5 text-primary" />
        <div className="mt-3 text-3xl font-semibold">Explore all printings</div>
        <div className="text-sm text-muted-foreground">Search every set.</div>
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
  );
}
