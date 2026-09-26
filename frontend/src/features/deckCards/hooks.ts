import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateDeckCard,
  createDeckCard,
  deleteDeckCard,
  getDeckCards,
  partialUpdateDeckCard,
  type PartialUpdateDeckCardData,
} from "./api";
import type { CreateDeckCardData } from "./types";

export function useDeckCards(deckId: string) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getDeckCards(deckId),
  });
}

export function useCreateDeckCard(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeckCardData) => createDeckCard(deckId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards", deckId],
      });

      await queryClient.refetchQueries({
        queryKey: ["deck", deckId],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}

export function useBulkCreateDeckCard(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeckCardData[]) =>
      bulkCreateDeckCard(deckId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards", deckId],
      });

      await queryClient.refetchQueries({
        queryKey: ["deck", deckId],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}

export function usePartialUpdateDeckCard(deckId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
      data: PartialUpdateDeckCardData;
    }) => {
      return partialUpdateDeckCard(deckId, cardId, data);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards", deckId],
      });

      await queryClient.refetchQueries({
        queryKey: ["deck", deckId],
      });
    },

    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}

export function useDeleteDeckCard(deckId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => {
      return deleteDeckCard(deckId, cardId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards", deckId],
      });
      await queryClient.refetchQueries({
        queryKey: ["deck", deckId],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}
