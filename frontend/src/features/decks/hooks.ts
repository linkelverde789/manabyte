import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeck, deleteDeck, getDeck, getDecks } from "./api";
import type { CreateDeckData } from "./types";
import { toast } from "sonner";

export function useDecks() {
  return useQuery({
    queryKey: ["decks"],
    queryFn: getDecks,
  });
}

export function useDeck(deckId: number) {
  return useQuery({
    queryKey: ["deck", deckId],
    queryFn: () => getDeck(deckId),
  });
}

export function useCreateDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDeckData) => createDeck(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["decks"],
      });
      toast.success("Deck created!");
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useDeleteDeck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deckId: number) => {
      return deleteDeck(deckId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["decks"],
      });
      toast.success("Deck deleted!");
    },

    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}
