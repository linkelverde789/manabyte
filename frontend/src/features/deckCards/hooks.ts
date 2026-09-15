import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDeckCard, deleteDeckCard, getDeckCards } from "./api";
import type { CreateDeckCardData } from "./types";

export function useDeckCards(deckId: number) {
    return useQuery({
        queryKey: ["cards", deckId],
        queryFn: () => getDeckCards(deckId),
    })
}

export function useCreateDeckCard(deckId: number) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateDeckCardData) => createDeckCard(deckId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cards", deckId]
            })
        },
        onError: (error) => {
            console.error("ERROR", error)
        }
    })
}

export function useDeleteDeckCard(deckId: number) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cardId: number) => { return deleteDeckCard(deckId, cardId) },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cards", deckId]
            })
        },
        onError: (error) => {
            console.error("ERROR", error);
        },
    })
}