import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateCollectionItem,
  createCollectionItem,
  deleteCollectionItem,
  getCollectionItems,
  listCollectionItemFromSet,
  partialUpdateCollectionItem,
} from "./api";
import type {
  BulkCreateCollectionItemData,
  CreateCollectionItemData,
  FilterCollectionParams,
  PartialUpdateCollectionItemData,
} from "./types";
import { toast } from "sonner";

export function useGetCollectionItems(params: FilterCollectionParams) {
  return useQuery({
    queryKey: ["collection", params.folderId],
    queryFn: () => getCollectionItems(params),
  });
}

export function useBulkCreateCollectionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: BulkCreateCollectionItemData) =>
      bulkCreateCollectionItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
    },
    onError: (error) => {
      toast.error(`${error}`);
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
      toast.success(`Card created!`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Ha ocurrido un error",
      );
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
      cardId: number;
      data: PartialUpdateCollectionItemData;
    }) => {
      return partialUpdateCollectionItem(cardId, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
      toast.success(`Card updated!`);
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useDeleteCollectionItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: number) => {
      return deleteCollectionItem(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
      toast.success(`Card deleted!`);
    },
    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useCollectionTotal(folderId: number) {
  const { data } = useGetCollectionItems({ folderId });

  return {
    total: data?.reduce((total, item) => total + item.quantity, 0) ?? 0,
    entries: data?.length,
  };
}

export function useListCollectionItemFromSet(scryfallIds?: string[]) {
  return useQuery({
    queryKey: ["collection", "set", scryfallIds],
    queryFn: () => listCollectionItemFromSet(scryfallIds!),
    enabled: !!scryfallIds?.length,
  });
}
