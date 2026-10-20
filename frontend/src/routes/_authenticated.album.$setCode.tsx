import AlbumCardSlot from "#/components/album/AlbumCardSlot";
import { SetHeader } from "#/components/album/SetHeader";
import { SetProgress } from "#/components/album/SetProgress";
import { SetAlbumSkeleton } from "#/components/album/skeletons";
import GeneralSearchDialog from "#/components/dialogs/GeneralDialog/GeneralSearchDialog";
import { Paginator } from "#/components/paginators/Paginator";
import { useListAlbum } from "#/features/album/hooks";
import { useGetSetInformation } from "#/features/scryfall/hooks";
import type { Card } from "#/lib/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/album/$setCode")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setCode } = Route.useParams();

  const { data: setInformation } = useGetSetInformation(setCode);

  const { data: collection, isLoading } = useListAlbum(setCode);

  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<Card | null>(null);

  if (isLoading) {
    return <SetAlbumSkeleton />;
  }

  if (!collection) {
    return;
  }

  function handlePickCard(card: Card) {
    setPicked(card);
    setOpen(true);
  }

  const elementsPerPage = 60;

  const totalPages = Math.ceil(collection.length / elementsPerPage);

  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const startIndex = (currentPage - 1) * elementsPerPage;
  const endIndex = startIndex + elementsPerPage;

  const result = collection.slice(startIndex, endIndex);

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
        <SetHeader
          setName={setInformation?.name!}
          icon={setInformation?.icon_svg_uri!}
        />

        <SetProgress
          setCollectionCount={setInformation?.card_count!}
          userCollectionCount={
            collection.filter((card) => card.quantity > 0).length
          }
        />

        <Paginator page={page} totalPages={totalPages} onChangePage={setPage} />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {result.map((card) => (
            <AlbumCardSlot
              key={card.external_id}
              card={card}
              onPickCard={handlePickCard}
            />
          ))}
        </div>
        <Paginator page={page} totalPages={totalPages} onChangePage={setPage} />
      </div>
      {picked && (
        <GeneralSearchDialog onOpenChange={setOpen} open={open} card={picked} />
      )}
    </>
  );
}
