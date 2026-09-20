import type { CreateDeckCardData } from "../deckCards/types";
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

export interface CreateCollectionItemData extends CreateDeckCardData {
  language: string;
  foil: boolean;
  condition: string;
  folder_id?: string | number;
}

export interface PartialUpdateCollectionItemData {
  scryfall_id?: string;
  quantity?: number;
  foil?: boolean;
  condition?: string;
  language?: string;
  folder_id?: number;
}

export interface FilterCollectionParams {
  folderId?: string | number;
}
