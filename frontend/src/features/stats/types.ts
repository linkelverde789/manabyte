export interface UserStats {
  decks: number;
  collection: CollectionStats;
}

export interface CollectionStats {
  unique_cards: number;
  total: number;
}

interface BasicStats {
  entries: number;
  cards: number;
  price: number;
}

export interface FolderStats extends BasicStats {
  folder_name: string;
}

export interface CollectionStats extends BasicStats {}
