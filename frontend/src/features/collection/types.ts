import type { Folder } from "../folders/types";

export interface CollectionItem {
  id: number;
  folder: Folder | null;
  scryfall_id: string;
  quantity: number;
  foil: boolean;
  language: string;
  condition: string;
}

export interface CreateCollectionItemData {
  scryfall_id: string;
  quantity: number;
  foil: boolean;
  condition: string;
  language: string;
  folder?: number;
  folderId?: string | number;
}

export interface PartialUpdateCollectionItemData {
  scryfall_id?: string;
  quantity?: number;
  foil?: boolean;
  condition?: string;
  language?: string;
  folder?: number;
}

export interface FilterCollectionParams {
  folderId?: string | number;
}
