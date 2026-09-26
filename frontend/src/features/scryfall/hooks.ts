import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loadCollection,
  loadSingleCard,
  randomCard,
  searchCard,
  searchCardFuzzy,
  searchCardStyles,
  type ScryfallCollectionIdentifier,
} from "./api";
import type { ScryfallCard } from "./types";

export function useSearchCard(text: string) {
  return useQuery({
    queryKey: ["search", text],
    queryFn: () => searchCard(text),
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
      console.error("ERROR", error);
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
