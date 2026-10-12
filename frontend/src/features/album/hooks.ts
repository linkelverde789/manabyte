import { useQuery } from "@tanstack/react-query";
import { listAlbum } from "./api";

export function useListAlbum(setCode: string) {
  return useQuery({
    queryKey: ["album"],
    queryFn: () => listAlbum(setCode),
    enabled: !!setCode,
  });
}
