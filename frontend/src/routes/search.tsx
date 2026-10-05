import CardSearch from "#/components/search/cardSearch";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Search cards
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Type a card name, then pick a printing to add it anywhere.
          </p>
        </div>
      </div>
      <CardSearch autoFocus />
    </div>
  );
}
