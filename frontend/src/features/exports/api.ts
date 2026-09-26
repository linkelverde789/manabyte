import type {
  CollectionExportData,
  DeckExportData,
  FolderExportData,
} from "./types";
import { api, type BlobResponse } from "#/api/manabyte";

export function getDeckExport(data: DeckExportData) {
  return api<BlobResponse>(`/export/deck/${data.deckId}/${data.format}/`, {
    responseType: "blob",
  });
}

export function getFolderExport(data: FolderExportData) {
  return api<BlobResponse>(`/export/folder/${data.folderId}/${data.format}/`, {
    responseType: "blob",
  });
}

export function getCollectionExport(data: CollectionExportData) {
  return api<BlobResponse>(`/export/collection/${data.format}/`, {
    responseType: "blob",
  });
}
