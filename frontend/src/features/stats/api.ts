import { api } from "#/api/manabyte";
import type { CollectionStats, FolderStats, UserStats } from "./types";

export function getStats() {
  return api<UserStats>("/stats/user/");
}
export function getFolderStats(folderId: number) {
  return api<FolderStats>(`/stats/folder/${folderId}`);
}

export function getCollectionStats() {
  return api<CollectionStats>(`/stats/collection/`);
}
