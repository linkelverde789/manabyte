import { api } from "#/api/manabyte";
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

  const queryString = searchParams.toString();
  return api<CollectionItem[]>(
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
