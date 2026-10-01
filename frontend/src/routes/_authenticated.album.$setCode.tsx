import AlbumCardSlot from "#/components/album/AlbumCardSlot";
import { SetHeader } from "#/components/album/SetHeader";
import { SetPaginator } from "#/components/album/SetPaginator";
import { SetProgress } from "#/components/album/SetProgress";
import { useListCollectionItemFromSet } from "#/features/collection/hooks";
import {
  useGetSetInformation,
  useListSetCollection,
} from "#/features/scryfall/hooks";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/album/$setCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setCode } = Route.useParams();

  const { data: setInformation } = useGetSetInformation(setCode);

  const { data: setCollection, isLoading: isSetLoading } =
    useListSetCollection(setCode);

  const scryfallIds = setCollection?.map((item) => item.id);

  const { data: collection = [], isLoading: isCollectionLoading } =
    useListCollectionItemFromSet(scryfallIds);

  const [page, setPage] = useState(1);

  if (isSetLoading || isCollectionLoading || !setCollection) {
    return <SetAlbumSkeleton />;
  }

  const elementsPerPage = 60;

  const totalPages = Math.ceil(setCollection.length / elementsPerPage);

  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const startIndex = (currentPage - 1) * elementsPerPage;
  const endIndex = startIndex + elementsPerPage;

  const result = setCollection.slice(startIndex, endIndex);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <SetHeader
        setName={setInformation?.name!}
        icon={setInformation?.icon_svg_uri!}
      />

      <SetProgress
        setCollectionCount={setInformation?.card_count!}
        userCollectionCount={collection.length}
      />

      <SetPaginator
        page={page}
        totalPages={totalPages}
        onChangePage={setPage}
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {result.map((card) => (
          <AlbumCardSlot
            key={card.id}
            card={card}
            dataCard={collection.find((item) => item.scryfall_id === card.id)}
          />
        ))}
      </div>
      <SetPaginator
        page={page}
        totalPages={totalPages}
        onChangePage={setPage}
      />
    </div>
  );
}

function AlbumCardSkeleton() {
  return (
    <div className="group flex flex-col items-center gap-1.5">
      <div className="aspect-[488/680] w-full animate-pulse rounded-xl border border-border bg-muted/40 shadow-md" />

      <div className="flex w-full items-center justify-between px-0.5">
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
        <div className="h-3 w-6 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

function SetHeaderSkeleton() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-md">
          <div className="h-8 w-10 animate-pulse rounded-lg bg-muted" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

function SetProgressSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      </div>

      <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
    </div>
  );
}

function SetPaginatorSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-3 shadow-sm">
      <div className="h-9 w-24 animate-pulse rounded-lg bg-muted" />

      <div className="flex items-center gap-2">
        <div className="h-4 w-12 animate-pulse rounded bg-muted" />
        <div className="h-4 w-8 animate-pulse rounded bg-muted" />
      </div>

      <div className="h-9 w-20 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export function SetAlbumSkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl space-y-6 px-4 py-10"
      aria-busy="true"
      aria-label="Loading set album"
    >
      <SetHeaderSkeleton />

      <SetProgressSkeleton />

      <SetPaginatorSkeleton />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 20 }).map((_, index) => (
          <AlbumCardSkeleton key={index} />
        ))}
      </div>

      <SetPaginatorSkeleton />
    </div>
  );
}
