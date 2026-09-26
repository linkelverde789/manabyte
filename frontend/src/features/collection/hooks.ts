import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateCollectionItem,
  createCollectionItem,
  deleteCollectionItem,
  getCollectionItems,
  partialUpdateCollectionItem,
} from "./api";
import type {
  CreateCollectionItemData,
  FilterCollectionParams,
  PartialUpdateCollectionItemData,
} from "./types";

export function useGetCollectionItems(params: FilterCollectionParams) {
  return useQuery({
    queryKey: ["collection"],
    queryFn: () => getCollectionItems(params),
  });
}

export function useBulkCreateCollectionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCollectionItemData[]) =>
      bulkCreateCollectionItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}

export function useCreateCollectionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionItemData) => createCollectionItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}

export function usePartialUpdateCollectionItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cardId,
      data,
    }: {
      cardId: string;
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
  });
}

export function useDeleteCollectionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => {
      return deleteCollectionItem(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
    },
    onError: (error) => {
      console.error("ERROR", error);
    },
  });
}
