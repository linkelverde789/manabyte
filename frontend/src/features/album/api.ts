import { api } from "#/api/manabyte";
import type { AlbumCard } from "./types";

export function listAlbum(setCode: string) {
  return api<AlbumCard[]>(`/sets/album/${setCode}`);
}
