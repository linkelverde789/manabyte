import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeck, deleteDeck, getDecks } from "./api";
import type { CreateDeckData } from "./types";

export function useDecks() {
    return useQuery({
        queryKey: ["decks"],
        queryFn: getDecks,
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
        },
        onError: (error) => {
            console.error("ERROR", error);
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

        },

        onError: (error) => {
            console.error("ERROR", error);
        },
    });
}