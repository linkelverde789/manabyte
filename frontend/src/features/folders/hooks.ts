import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFolder, deleteFolder, getFolder, listFolders } from "./api";
import type { CreateFolderData } from "./types";
import { toast } from "sonner";
import { useAuth } from "#/contexts/AuthContext";

export function useListFolders() {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["folders"],
    queryFn: listFolders,
    enabled: isAuthenticated && !loading,
  });
}

export function useGetFolder(folderId: number) {
  const { isAuthenticated, loading } = useAuth();

  return useQuery({
    queryKey: ["folders", folderId],
    queryFn: () => getFolder(folderId),
    enabled: isAuthenticated && !loading,
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
      toast.success("Folder created!");
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
      toast.success("Folder deleted!");
    },

    onError: (error) => {
      toast.error(`${error}`);
    },
  });
}
