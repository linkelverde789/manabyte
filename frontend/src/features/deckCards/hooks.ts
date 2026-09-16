import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkCreateDeckCard, createDeckCard, deleteDeckCard, getDeckCards, partialUpdateDeckCard, type PartialUpdateDeckCardData } from "./api";
import type { CreateDeckCardData } from "./types";

export function useDeckCards(deckId: number | string) {
    return useQuery({
        queryKey: ["cards", deckId],
        queryFn: () => getDeckCards(deckId),
    })
}

export function useCreateDeckCard(deckId: number | string) {
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

export function useBulkCreateDeckCard(deckId: number | string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateDeckCardData[]) => bulkCreateDeckCard(deckId, data),
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

export function usePartialUpdateDeckCard(
    deckId: number | string
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            cardId,
            data,
        }: {
            cardId: number | string;
            data: PartialUpdateDeckCardData;
        }) => {
            return partialUpdateDeckCard(deckId, cardId, data);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["cards", deckId],
            });
        },

        onError: (error) => {
            console.error("ERROR", error);
        },
    });
}

export function useDeleteDeckCard(deckId: number | string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cardId: number | string) => { return deleteDeckCard(deckId, cardId) },
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

