import { api } from "#/api/manabyte";
import type { PaginatedResult } from "#/lib/types";
import type {
  BulkCreateCollectionItemData,
  CollectionItem,
  CreateCollectionItemData,
  FilterCollectionParams,
  PartialUpdateCollectionItemData,
} from "./types";

export function getCollectionItems(params: FilterCollectionParams) {
  const searchParams = new URLSearchParams();

  if (params?.folderId !== undefined) {
    searchParams.set("folder_id", String(params.folderId));
  }

  if (params?.sorting !== undefined) {
    searchParams.set("sorting", String(params.sorting));
  }

  if (params?.q !== undefined && params.q != "") {
    searchParams.set("q", String(params.q));
  }

  if (params?.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  const queryString = searchParams.toString();
  return api<PaginatedResult<CollectionItem>>(
    `/collection/${queryString ? `?${queryString}` : ""}`,
  );
}

export function createCollectionItem(data: CreateCollectionItemData) {
  return api<CollectionItem>("/collection/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function bulkCreateCollectionItem(data: BulkCreateCollectionItemData) {
  return api<CollectionItem[]>("/collection/bulk/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function partialUpdateCollectionItem(
  cardId: number,
  data: PartialUpdateCollectionItemData,
) {
  return api<CollectionItem>(`/collection/${cardId}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCollectionItem(cardId: number) {
  return api<number>(`/collection/${cardId}/`, { method: "DELETE" });
}

export function listCollectionItemFromSet(scryfallIds: string[]) {
  return api<CollectionItem[]>(`/collection/set/`, {
    method: "POST",
    body: JSON.stringify({
      scryfall_ids: scryfallIds.join(","),
    }),
  });
}
