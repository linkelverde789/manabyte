import { useQuery } from "@tanstack/react-query";
import type {
  CollectionExportData,
  DeckExportData,
  FolderExportData,
} from "./types";
import { getCollectionExport, getDeckExport, getFolderExport } from "./api";

export function useDeckExport(data: DeckExportData) {
  return useQuery({
    queryKey: ["export", data.deckId, data.format],
    queryFn: () => getDeckExport(data),
    enabled: !!data.deckId && !!data.format,
  });
}

export function useFolderExport(data: FolderExportData) {
  return useQuery({
    queryKey: ["export", data.folderId, data.format],
    queryFn: () => getFolderExport(data),
    enabled: !!data.folderId && !!data.format,
  });
}

export function useCollectionExport(data: CollectionExportData) {
  return useQuery({
    queryKey: ["export", data.format],
    queryFn: () => getCollectionExport(data),
    enabled: !!data.format,
  });
}
