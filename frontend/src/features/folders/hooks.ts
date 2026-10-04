import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFolder, deleteFolder, getFolder, listFolders } from "./api";
import type { CreateFolderData } from "./types";
import { toast } from "sonner";

export function useListFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
  });
}

export function useGetFolder(folderId: number) {
  return useQuery({
    queryKey: ["folders", folderId],
    queryFn: () => getFolder(folderId),
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFolderData) => createFolder(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },

    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderId: number) => deleteFolder(folderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["folders"],
      });
    },

    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}
