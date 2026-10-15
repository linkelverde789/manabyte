export interface UserStats {
  decks: number;
  collection: CollectionStats;
}

export interface CollectionStats {
  unique_cards: number;
  total: number;
}

export interface FolderStats {
  folder_name: string;
  entries: number;
  cards: number;
  price: number;
}
