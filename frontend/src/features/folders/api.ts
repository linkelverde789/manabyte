import { api } from "#/api/manabyte";
import type { CreateFolderData, Folder } from "./types";

export function listFolders() {
  return api<Folder[]>("/folder/");
}
export function getFolder(folderId: number) {
  return api<Folder>(`/folder/${folderId}/`);
}
export function createFolder(data: CreateFolderData) {
  return api<Folder>(`/folder/`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
export function deleteFolder(folderId: number) {
  return api<Folder>(`/folder/${folderId}/`, { method: "DELETE" });
}
