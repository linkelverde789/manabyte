import { Input } from "#/components/ui/input";
import { useListSets } from "#/features/scryfall/hooks";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookImage } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/album/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: sets, isLoading } = useListSets();
  const [query, setQuery] = useState("");

  if (isLoading) {
    return <AlbumIndexSkeleton />;
  }

  if (!sets) {
    return <div>No sets found</div>;
  }

  const q = query.trim().toLowerCase();
  const filteredSets = q
    ? sets.data.filter(
        (s) =>
          s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q),
      )
    : sets.data;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-16">
      <div className="flex items-center gap-3">
        <BookImage className="h-8 w-8 text-primary" />
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Set albums
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Choose a set
          </h1>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${sets.data.length} sets`}
          autoFocus
        />
        <ul className="mt-4 max-h-80 overflow-y-auto rounded-md border">
          {filteredSets.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              No sets match “{query.trim()}”
            </li>
          ) : (
            filteredSets.map((s) => (
              <li key={s.code}>
                <Link
                  to="/album/$setCode"
                  params={{ setCode: s.code }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent"
                >
                  <img
                    src={s.icon_svg_uri}
                    alt=""
                    className="h-4 w-4 invert opacity-80"
                  />
                  {s.name}
                  <span className="text-xs uppercase text-muted-foreground">
                    {s.code}
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function SetListItemSkeleton() {
  return (
    <li className="flex items-center gap-2 px-3 py-2">
      <div className="h-4 w-4 animate-pulse rounded bg-muted" />

      <div className="h-4 w-32 animate-pulse rounded bg-muted" />

      <div className="ml-auto h-3 w-8 animate-pulse rounded bg-muted" />
    </li>
  );
}

export function AlbumIndexSkeleton() {
  return (
    <div
      className="mx-auto max-w-2xl space-y-4 px-4 py-16"
      aria-busy="true"
      aria-label="Loading set albums"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />

        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
          <div className="h-9 w-44 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* Search + list */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        {/* Search input */}
        <div className="h-10 w-full animate-pulse rounded-md bg-muted" />

        {/* Sets list */}
        <ul className="mt-4 max-h-80 overflow-hidden rounded-md border">
          {Array.from({ length: 10 }).map((_, index) => (
            <SetListItemSkeleton key={index} />
          ))}
        </ul>
      </div>
    </div>
  );
}
