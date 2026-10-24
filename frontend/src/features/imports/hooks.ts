import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { check } from "./api";

export function useCheckImport() {
  return useMutation({
    mutationFn: (data: string) => check(data),
    onError: (error) => {
      toast.error(String(error));
    },
  });
}
