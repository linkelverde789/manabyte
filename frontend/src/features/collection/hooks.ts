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
  CreateCollectionItemData,
  FilterCollectionParams,
  PartialUpdateCollectionItemData,
} from "./types";
import { toast } from "sonner";

export function useGetCollectionItems(params: FilterCollectionParams) {
  return useQuery({
    queryKey: ["collection", params],
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
      queryClient.invalidateQueries({
        queryKey: ["stats-folder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats-collection"],
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
      queryClient.invalidateQueries({
        queryKey: ["stats-folder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats-collection"],
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
      queryClient.invalidateQueries({
        queryKey: ["stats-folder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats-collection"],
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

    onError: (error) => {
      toast.error(`${error}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats-folder"],
      });
      queryClient.invalidateQueries({
        queryKey: ["stats-collection"],
      });
      toast.success("Card deleted!");
    },
  });
}

export function useCollectionTotal(folderId: number) {
  const { data: res } = useGetCollectionItems({ folderId });

  return {
    total: res?.data.reduce((total, item) => total + item.quantity, 0) ?? 0,
    entries: res?.data.length,
  };
}
