import { Layers } from "lucide-react";

export default function EmptyDeck() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Layers className="h-5 w-5 text-muted-foreground" />
      </div>

      <h2 className="text-sm font-medium">This deck is empty</h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Add some cards to start building your deck.
      </p>
    </div>
  );
}
