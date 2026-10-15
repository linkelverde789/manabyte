import { api } from "#/api/manabyte";
import type { FolderStats, UserStats } from "./types";

export function getStats() {
  return api<UserStats>("/stats/");
}
export function getFolderStats(folderId: number) {
  return api<FolderStats>(`/stats/folder/${folderId}`);
}
