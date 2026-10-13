import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  bulkCreateCollectionItem,
  createCollectionItem,
  deleteCollectionItem,
  getCollectionItems,
  partialUpdateCollectionItem,
} from "./api";
import type {
  BulkCreateCollectionItemData,
  CollectionItem,
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

      toast.dismiss();
      toast.success(`List imported to this collection!`);
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
      toast.success(`Card added to collection!`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "An error ocurred");
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
    mutationFn: (cardId: number) => deleteCollectionItem(cardId),

    onMutate: async (cardId) => {
      await queryClient.cancelQueries({
        queryKey: ["collection"],
      });

      const previousCollections = queryClient.getQueriesData<CollectionItem[]>({
        queryKey: ["collection"],
      });

      queryClient.setQueriesData<CollectionItem[]>(
        { queryKey: ["collection"] },
        (old) => old?.filter((item) => item.id !== cardId),
      );

      return { previousCollections };
    },

    onError: (error, _cardId, context) => {
      context?.previousCollections.forEach(([queryKey, data]) => {
        if (data !== undefined) {
          queryClient.setQueryData(queryKey, data);
        }
      });

      toast.error(`${error}`);
    },

    onSuccess: () => {
      toast.success("Card deleted!");
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
