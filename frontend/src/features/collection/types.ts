import type { BaseCardInformation } from "#/lib/types";
import type { CreateDeckCardData } from "../deckCards/types";
import type { Folder } from "../folders/types";

export interface CollectionItem extends BaseCardInformation {
  folder: Folder | null;
  foil: boolean;
  language: string;
  condition: string;
}

export interface BulkCreateCollectionItem extends CreateDeckCardData {
  language: string;
  foil: boolean;
  condition: string;
}

export interface BulkCreateCollectionItemData {
  items: BulkCreateCollectionItem[];
  folder_id?: number;
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
  sorting?: string;
  q?: string;
}
