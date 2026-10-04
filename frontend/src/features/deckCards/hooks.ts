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
import { toast } from "sonner";

export function useDeckCards(deckId: number) {
  return useQuery({
    queryKey: ["cards", deckId],
    queryFn: () => getDeckCards(deckId),
  });
}

export function useCreateDeckCard(deckId: number) {
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
      toast.success(`Card added to the deck!`);
      
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useBulkCreateDeckCard(deckId: number) {
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
      toast.error(`${error}`);
    },
  });
}

export function usePartialUpdateDeckCard(deckId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: number;
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

      toast.success(`Card updated!`);

    },

    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useDeleteDeckCard(deckId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: number) => {
      return deleteDeckCard(deckId, cardId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["cards", deckId],
      });
      await queryClient.refetchQueries({
        queryKey: ["deck", deckId],
      });

      toast.success(`Card deleted from the deck!`);

    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}
