import { useQuery } from "@tanstack/react-query";
import { getStats } from "./api";

export function useGetStats() {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
  });
}
