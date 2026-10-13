import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSetInformation,
  listSetCollection,
  listSets,
  loadCollection,
  loadSingleCard,
  randomCard,
  searchCardFuzzy,
  searchCardScryfall,
  searchCardStyles,
  type ScryfallCollectionIdentifier,
} from "./api";
import type { ScryfallCard } from "./types";
import { toast } from "sonner";

export function useSearchCardScryfall(text: string) {
  return useQuery({
    queryKey: ["search", text],
    queryFn: () => searchCardScryfall(text),
    enabled: text.length > 2,
  });
}

export function useRandomCard() {
  return useQuery({
    queryKey: ["random"],
    queryFn: randomCard,
  });
}

export function useLoadSingleCard(scryfallId: number) {
  return useQuery({
    queryKey: ["scryfall-load-single", scryfallId],
    queryFn: () => loadSingleCard(scryfallId),
  });
}

export function useLoadCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (identifiers: ScryfallCollectionIdentifier[]) => {
      const BATCH_SIZE = 75;
      const cards: ScryfallCard[] = [];

      for (let i = 0; i < identifiers.length; i += BATCH_SIZE) {
        const batch = identifiers.slice(i, i + BATCH_SIZE);

        const result = await loadCollection(batch);

        cards.push(...result.data);
      }

      return {
        data: cards,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scryfall-load-collection"],
      });
    },

    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });
}

export function useSearchCardFuzzy(text: string) {
  return useQuery({
    queryKey: ["search-fuzzy", text],
    queryFn: () => searchCardFuzzy(text),
    enabled: text.length > 2,
  });
}

export function useSearchCardStyles(text: string) {
  return useQuery({
    queryKey: ["search-styles", text],
    queryFn: () => searchCardStyles(text),
    enabled: text.length > 2 && !!text,
  });
}

export function useListSetCollection(setCode: string) {
  return useQuery({
    queryKey: ["set-collection", setCode],
    queryFn: async () => {
      let page = 1;
      let allCards: ScryfallCard[] = [];
      let hasMore = true;

      while (hasMore) {
        const result = await listSetCollection(setCode, page);

        allCards = [...allCards, ...result.data];

        hasMore = result.has_more;
        page++;
      }

      return allCards;
    },
    enabled: setCode.length > 2,
  });
}

export function useGetSetInformation(setCode: string) {
  return useQuery({
    queryKey: ["set", setCode],
    queryFn: () => getSetInformation(setCode),
    enabled: setCode.length > 2 && !!setCode,
  });
}

export function useListSets() {
  return useQuery({
    queryKey: ["sets"],
    queryFn: listSets,
  });
}
