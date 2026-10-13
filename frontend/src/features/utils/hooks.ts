import { useQuery } from "@tanstack/react-query";
import { listCardPrints, searchCard, listSet } from "./api";

export function useListPrints(oracle_id: string) {
  return useQuery({
    queryKey: ["prints", oracle_id],
    queryFn: () => listCardPrints(oracle_id),
    enabled: !!oracle_id,
  });
}

export function useCardSearch(text: string) {
  return useQuery({
    queryKey: ["search", text],
    queryFn: () => searchCard(text),
    enabled: !!text && text.length > 2,
  });
}

export function useListSets() {
  return useQuery({
    queryKey: ["sets"],
    queryFn: () => listSet(),
  });
}
