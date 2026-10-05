import AlbumCardSlot from "#/components/album/AlbumCardSlot";
import { SetHeader } from "#/components/album/SetHeader";
import { SetPaginator } from "#/components/album/SetPaginator";
import { SetProgress } from "#/components/album/SetProgress";
import { SetAlbumSkeleton } from "#/components/album/skeletons";
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
