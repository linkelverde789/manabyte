import { useQuery } from "@tanstack/react-query";
import { getFolderStats, getStats } from "./api";

export function useGetStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
}

export function useGetFolderStats(folderId: number) {
  return useQuery({
    queryKey: ["stats-folder", folderId],
    queryFn: () => getFolderStats(folderId),
  });
}
