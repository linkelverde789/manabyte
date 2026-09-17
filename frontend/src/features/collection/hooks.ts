import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCollectionItem, deleteCollectionItem, getCollectionItems, partialUpdateCollectionItem } from "./api";
import type { CreateCollectionItemData, PartialUpdateCollectionItemData } from "./types";


export function useGetCollectionItems(){
    return useQuery({
        queryKey: ["collection"],
        queryFn: getCollectionItems,
    });
}

export function useCreateCollectionItem(){
    const queryClient = useQueryClient();
    

    return useMutation({
        mutationFn: (data:CreateCollectionItemData) => createCollectionItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collection"],
            });
        },
        onError: (error) => {
            console.error("ERROR", error);
        },
    })
}

export function usePartialUpdateCollectionItem(){
    const queryClient = useQueryClient();
    

    return useMutation({
        mutationFn: ({
            cardId,
            data,
        }: {
            cardId: number | string;
            data: PartialUpdateCollectionItemData;
        }) => {
            return partialUpdateCollectionItem(cardId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collection"],
            });
        },
        onError: (error) => {
            console.error("ERROR", error);
        },
    })
}

export function useDeleteCollectionItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (cardId: number | string) => { return deleteCollectionItem(cardId) },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["collection"]
            })
        },
        onError: (error) => {
            console.error("ERROR", error);
        },
    })
}