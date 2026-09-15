import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loadCollection, loadSingleCard, randomCard, searchCard, type ScryfallCollectionIdentifier } from "./api";

export function useSearchCard(text: string) {

    return useQuery({
        queryKey: ["search", text],
        queryFn: () => searchCard(text),
        enabled: text.length > 2
    })
}

export function useRandomCard() {
    return useQuery({
        queryKey: ["random"],
        queryFn: randomCard,
    })
}

export function useLoadSingleCard(scryfallId: string) {
    return useQuery({
        queryKey: ["scryfall-load-single", scryfallId],
        queryFn: () => loadSingleCard(scryfallId)
    })
}

export function useLoadCollection() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: ScryfallCollectionIdentifier[]) => loadCollection(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["scryfall-load-collection"]
            })
        },
        onError: (error) => {
            console.error("ERROR", error)
        },

    })
}