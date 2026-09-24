export interface UserStats {
  decks: number;
  collection: CollectionStats;
}

export interface CollectionStats {
  unique_cards: number;
  total: number;
}
